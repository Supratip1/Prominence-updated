"""
Scrapy integration for the Domain Content Scraper
Handles running Scrapy spiders asynchronously with our universal model
"""
import asyncio
import subprocess
import os
import json
import tempfile
import uuid
from typing import Dict, Any, Optional, List
from datetime import datetime
from .models import ScrapeRequest, JobStatus, PageContent, ContentBlock

class ScrapyRunner:
    """Handles running Scrapy spiders asynchronously"""
    
    def __init__(self):
        self.running_jobs: Dict[str, asyncio.Task] = {}
        self.job_results: Dict[str, Dict[str, Any]] = {}
        self.job_progress: Dict[str, int] = {}
    
    async def start_scraping(self, job_id: str, request: ScrapeRequest) -> bool:
        """Start scraping process asynchronously"""
        try:
            # Create async task for scraping
            task = asyncio.create_task(self._run_scraping_task(job_id, request))
            self.running_jobs[job_id] = task
            self.job_progress[job_id] = 0
            
            print(f"✅ Started scrape job {job_id} for domain {request.domain}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to start scraping job {job_id}: {e}")
            return False
    
    async def _run_scraping_task(self, job_id: str, request: ScrapeRequest):
        """Run the actual scraping task"""
        try:
            # Create temporary output file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as temp_file:
                output_file = temp_file.name
            
            # Build scrapy command
            cmd = [
                'scrapy', 'crawl', 'domain_spider',
                '-a', f'domain={request.domain}',
                '-a', f'max_pages={request.max_pages}',
                '-a', f'output_file={output_file}',
                '-s', 'LOG_LEVEL=WARNING'  # Reduce log noise
            ]
            
            print(f"🕷️ Running: {' '.join(cmd)}")
            
            # Run scrapy synchronously in a thread (works on Windows)
            def _sync_run():
                return subprocess.run(
                    cmd,
                    cwd=os.getcwd(),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    check=False,
                )

            # offload to a thread so we don't block asyncio
            result = await asyncio.to_thread(_sync_run)
            stdout, stderr = result.stdout, result.stderr
            returncode = result.returncode

            # Update progress
            self.job_progress[job_id] = 25
            
            if returncode == 0:
                # Success! Load results
                self.job_progress[job_id] = 75
                await self._load_scraping_results(job_id, output_file)
                self.job_progress[job_id] = 100
                print(f"✅ Scraping job {job_id} completed successfully")
            else:
                # Error occurred
                error_msg = stderr.decode() if stderr else "Unknown error"
                print(f"❌ Scraping job {job_id} failed: {error_msg}")
                self.job_results[job_id] = {
                    'status': 'failed',
                    'error': error_msg,
                    'completed_at': datetime.now().isoformat()
                }
            
            # Cleanup temp file
            try:
                os.unlink(output_file)
            except:
                pass
                
        except asyncio.CancelledError:
            print(f"🛑 Scraping job {job_id} was cancelled")
            self.job_results[job_id] = {
                'status': 'cancelled',
                'completed_at': datetime.now().isoformat()
            }
            raise
        except Exception as e:
            print(f"💥 Scraping job {job_id} crashed: {e}")
            self.job_results[job_id] = {
                'status': 'failed',
                'error': str(e),
                'completed_at': datetime.now().isoformat()
            }
    
    async def _load_scraping_results(self, job_id: str, output_file: str):
        """Load and parse scraping results from output file"""
        try:
            if not os.path.exists(output_file):
                raise FileNotFoundError(f"Output file not found: {output_file}")
            
            with open(output_file, 'r', encoding='utf-8') as f:
                raw_data = json.load(f)
            
            # Convert to our PageContent format
            pages = []
            for page_data in raw_data.get('pages', []):
                # Convert blocks to ContentBlock objects
                content_blocks = []
                for block_data in page_data.get('blocks', []):
                    content_block = ContentBlock(
                        id=block_data.get('id'),
                        type=block_data.get('type'),
                        content=block_data.get('content'),
                        data=block_data.get('data', {}),
                        parent_id=block_data.get('parent_id'),
                        level=block_data.get('level')
                    )
                    content_blocks.append(content_block)
                
                # Create PageContent object
                page_content = PageContent(
                    url=page_data.get('url'),
                    title=page_data.get('title'),
                    blocks=content_blocks,
                    metadata=page_data.get('metadata', {})
                )
                pages.append(page_content)
            
            # Store results
            self.job_results[job_id] = {
                'status': 'completed',
                'pages': pages,
                'summary': raw_data.get('summary', {}),
                'completed_at': datetime.now().isoformat()
            }
            
            print(f"📊 Loaded {len(pages)} pages with {sum(len(p.blocks) for p in pages)} content blocks")
            
        except Exception as e:
            print(f"❌ Failed to load results for job {job_id}: {e}")
            self.job_results[job_id] = {
                'status': 'failed',
                'error': f"Failed to load results: {str(e)}",
                'completed_at': datetime.now().isoformat()
            }
    
    def get_job_status(self, job_id: str) -> JobStatus:
        """Get the status of a running job"""
        # Check if job has completed results
        if job_id in self.job_results:
            result = self.job_results[job_id]
            if result['status'] == 'completed':
                return JobStatus.COMPLETED
            elif result['status'] == 'failed':
                return JobStatus.FAILED
            elif result['status'] == 'cancelled':
                return JobStatus.CANCELLED
        
        # Check running tasks
        if job_id in self.running_jobs:
            task = self.running_jobs[job_id]
            if task.done():
                # Task finished, check for results
                if job_id in self.job_results:
                    result = self.job_results[job_id]
                    if result['status'] == 'completed':
                        return JobStatus.COMPLETED
                    else:
                        return JobStatus.FAILED
                return JobStatus.FAILED
            return JobStatus.RUNNING
        
        return JobStatus.PENDING
    
    def get_job_progress(self, job_id: str) -> int:
        """Get job progress percentage (0-100)"""
        return self.job_progress.get(job_id, 0)
    
    def get_job_results(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get job results if completed"""
        return self.job_results.get(job_id)
    
    async def stop_scraping(self, job_id: str) -> bool:
        """Stop a running scraping job"""
        if job_id in self.running_jobs:
            task = self.running_jobs[job_id]
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass
            del self.running_jobs[job_id]
            return True
        return False
    
    def cleanup_job(self, job_id: str):
        """Clean up job data"""
        self.job_results.pop(job_id, None)
        self.job_progress.pop(job_id, None)
        if job_id in self.running_jobs:
            del self.running_jobs[job_id]

# Global scraper instance
scraper_runner: Optional[ScrapyRunner] = None

def get_scraper() -> ScrapyRunner:
    """Get scraper runner instance"""
    global scraper_runner
    if scraper_runner is None:
        scraper_runner = ScrapyRunner()
    return scraper_runner 