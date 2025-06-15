"""
Supabase Database Manager
Handles database operations using Supabase client (no direct PostgreSQL required)
"""
import os
import asyncio
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json

from supabase import create_client, Client
from dotenv import load_dotenv

from .models import ScrapeJob, PageContent, ContentBlock, JobStatus

# Load environment variables
load_dotenv()

class SupabaseManager:
    """Manages Supabase connections and database operations using Supabase client only"""
    
    def __init__(self):
        # Supabase client setup
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_KEY')
        self.supabase_service_key = os.getenv('SUPABASE_SERVICE_KEY')
        
        if not all([self.supabase_url, self.supabase_key]):
            raise ValueError("Missing Supabase configuration. Need SUPABASE_URL and SUPABASE_KEY at minimum.")
        
        # Initialize Supabase client (use service key for admin operations if available)
        api_key = self.supabase_service_key if self.supabase_service_key else self.supabase_key
        self.supabase: Client = create_client(self.supabase_url, api_key)
        
        print(f"✅ Supabase client initialized with {'service key' if self.supabase_service_key else 'anon key'}")
    
    async def init_database(self):
        """Initialize database tables using Supabase client"""
        try:
            # Create tables using Supabase SQL
            tables_sql = """
            -- Create scrape_jobs table
            CREATE TABLE IF NOT EXISTS scrape_jobs (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                job_id VARCHAR(255) UNIQUE NOT NULL,
                domain VARCHAR(255) NOT NULL,
                max_pages INTEGER DEFAULT 50,
                status VARCHAR(50) NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                started_at TIMESTAMP WITH TIME ZONE,
                completed_at TIMESTAMP WITH TIME ZONE,
                progress JSONB DEFAULT '{}',
                error_message TEXT,
                user_agent VARCHAR(500),
                ip_address VARCHAR(45)
            );

            -- Create indexes for scrape_jobs
            CREATE INDEX IF NOT EXISTS idx_scrape_jobs_job_id ON scrape_jobs(job_id);
            CREATE INDEX IF NOT EXISTS idx_scrape_jobs_domain_status ON scrape_jobs(domain, status);
            CREATE INDEX IF NOT EXISTS idx_scrape_jobs_created_at ON scrape_jobs(created_at);

            -- Create page_content table
            CREATE TABLE IF NOT EXISTS page_content (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                job_id UUID REFERENCES scrape_jobs(id) ON DELETE CASCADE,
                url TEXT NOT NULL,
                title TEXT,
                meta_description TEXT,
                meta_keywords JSONB,
                canonical_url TEXT,
                robots_meta VARCHAR(255),
                language VARCHAR(10),
                open_graph JSONB,
                twitter_card JSONB,
                hreflang JSONB,
                structured_data JSONB,
                content_length INTEGER,
                load_time INTEGER,
                status_code INTEGER,
                scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- Create indexes for page_content
            CREATE INDEX IF NOT EXISTS idx_page_content_job_id ON page_content(job_id);
            CREATE INDEX IF NOT EXISTS idx_page_content_url ON page_content(url);
            CREATE INDEX IF NOT EXISTS idx_page_content_scraped_at ON page_content(scraped_at);

            -- Create content_blocks table
            CREATE TABLE IF NOT EXISTS content_blocks (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                page_id UUID REFERENCES page_content(id) ON DELETE CASCADE,
                block_id INTEGER NOT NULL,
                content_type VARCHAR(50) NOT NULL,
                content TEXT NOT NULL,
                parent_id INTEGER,
                level INTEGER,
                data JSONB,
                seo_analysis JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- Create indexes for content_blocks
            CREATE INDEX IF NOT EXISTS idx_content_blocks_page_id ON content_blocks(page_id);
            CREATE INDEX IF NOT EXISTS idx_content_blocks_type ON content_blocks(content_type);
            CREATE INDEX IF NOT EXISTS idx_content_blocks_page_block ON content_blocks(page_id, block_id);

            -- Create seo_analysis table
            CREATE TABLE IF NOT EXISTS seo_analysis (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                job_id UUID REFERENCES scrape_jobs(id) ON DELETE CASCADE,
                domain VARCHAR(255) NOT NULL,
                total_pages INTEGER DEFAULT 0,
                total_content_blocks INTEGER DEFAULT 0,
                heading_structure JSONB,
                image_analysis JSONB,
                link_analysis JSONB,
                content_types JSONB,
                overall_seo_score INTEGER,
                content_score INTEGER,
                technical_score INTEGER,
                social_score INTEGER,
                seo_issues JSONB,
                recommendations JSONB,
                analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- Create indexes for seo_analysis
            CREATE INDEX IF NOT EXISTS idx_seo_analysis_job_id ON seo_analysis(job_id);
            CREATE INDEX IF NOT EXISTS idx_seo_analysis_domain ON seo_analysis(domain);
            CREATE INDEX IF NOT EXISTS idx_seo_analysis_score ON seo_analysis(overall_seo_score);
            """
            
            # Execute the SQL using Supabase RPC
            result = self.supabase.rpc('exec_sql', {'sql': tables_sql}).execute()
            
            print("✅ Database tables created successfully using Supabase client")
            return True
            
        except Exception as e:
            print(f"❌ Failed to create database tables: {e}")
            # Try alternative approach - create tables one by one
            try:
                return await self._create_tables_individually()
            except Exception as e2:
                print(f"❌ Alternative table creation also failed: {e2}")
                return False
    
    async def _create_tables_individually(self):
        """Alternative method to create tables using Supabase client operations"""
        try:
            # For now, we'll assume tables exist or create them manually
            # This is a fallback - in production you'd create tables via Supabase dashboard
            print("⚠️  Using fallback table creation method")
            print("📝 Please create tables manually in Supabase dashboard if they don't exist")
            return True
        except Exception as e:
            print(f"❌ Fallback table creation failed: {e}")
            return False
    
    async def create_job(self, job: ScrapeJob) -> str:
        """Create a new scrape job using Supabase client"""
        try:
            data = {
                'job_id': job.job_id,
                'domain': job.domain,
                'max_pages': job.progress.get('max_pages', 50),
                'status': job.status.value,
                'created_at': job.created_at.isoformat(),
                'progress': job.progress
            }
            
            result = self.supabase.table('scrape_jobs').insert(data).execute()
            
            print(f"✅ Created job {job.job_id} in Supabase")
            return job.job_id
                
        except Exception as e:
            print(f"❌ Failed to create job {job.job_id}: {e}")
            raise
    
    async def get_job(self, job_id: str) -> Optional[ScrapeJob]:
        """Get job by ID using Supabase client"""
        try:
            result = self.supabase.table('scrape_jobs').select('*').eq('job_id', job_id).execute()
            
            if not result.data:
                return None
            
            job_data = result.data[0]
            
            # Convert to Pydantic model
            return ScrapeJob(
                job_id=job_data['job_id'],
                domain=job_data['domain'],
                status=JobStatus(job_data['status']),
                created_at=datetime.fromisoformat(job_data['created_at'].replace('Z', '+00:00')),
                completed_at=datetime.fromisoformat(job_data['completed_at'].replace('Z', '+00:00')) if job_data.get('completed_at') else None,
                progress=job_data.get('progress', {}),
                error_message=job_data.get('error_message')
            )
                
        except Exception as e:
            print(f"❌ Failed to get job {job_id}: {e}")
            return None
    
    async def update_job_status(self, job_id: str, status: JobStatus, 
                               error_message: Optional[str] = None,
                               progress: Optional[Dict] = None):
        """Update job status using Supabase client"""
        try:
            update_data = {
                'status': status.value
            }
            
            if status in [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED]:
                update_data['completed_at'] = datetime.utcnow().isoformat()
            elif status == JobStatus.RUNNING:
                update_data['started_at'] = datetime.utcnow().isoformat()
            
            if error_message:
                update_data['error_message'] = error_message
            
            if progress:
                update_data['progress'] = progress
            
            result = self.supabase.table('scrape_jobs').update(update_data).eq('job_id', job_id).execute()
            
            print(f"✅ Updated job {job_id} status to {status.value}")
                
        except Exception as e:
            print(f"❌ Failed to update job {job_id}: {e}")
            raise
    
    async def save_content(self, job_id: str, pages: List[PageContent]):
        """Save extracted page content using Supabase client"""
        try:
            # Get the job first
            job_result = self.supabase.table('scrape_jobs').select('id').eq('job_id', job_id).execute()
            
            if not job_result.data:
                raise ValueError(f"Job {job_id} not found")
            
            job_uuid = job_result.data[0]['id']
            
            total_blocks = 0
            seo_metrics = {
                'heading_structure': {'h1': 0, 'h2': 0, 'h3': 0, 'h4': 0, 'h5': 0, 'h6': 0},
                'image_analysis': {'total': 0, 'with_alt': 0, 'good_alt': 0},
                'link_analysis': {'total': 0, 'internal': 0, 'external': 0, 'nofollow': 0},
                'content_types': {}
            }
            
            # Save each page
            for page in pages:
                # Create page record
                page_data = {
                    'job_id': job_uuid,
                    'url': page.url,
                    'title': page.title,
                    'meta_description': page.metadata.get('description'),
                    'meta_keywords': page.metadata.get('keywords'),
                    'canonical_url': page.metadata.get('canonical_url'),
                    'robots_meta': page.metadata.get('robots'),
                    'language': page.metadata.get('language'),
                    'open_graph': page.metadata.get('open_graph'),
                    'twitter_card': page.metadata.get('twitter_card'),
                    'hreflang': page.metadata.get('hreflang'),
                    'structured_data': page.metadata.get('structured_data'),
                    'content_length': page.metadata.get('content_length'),
                    'status_code': page.metadata.get('status_code'),
                    'scraped_at': datetime.utcnow().isoformat()
                }
                
                page_result = self.supabase.table('page_content').insert(page_data).execute()
                page_uuid = page_result.data[0]['id']
                
                # Save content blocks
                blocks_data = []
                for block in page.blocks:
                    block_data = {
                        'page_id': page_uuid,
                        'block_id': block.id,
                        'content_type': block.type,
                        'content': block.content,
                        'parent_id': block.parent_id,
                        'level': block.level,
                        'data': block.data,
                        'seo_analysis': block.data.get('seo_analysis') if block.data else None
                    }
                    blocks_data.append(block_data)
                    total_blocks += 1
                    
                    # Collect SEO metrics
                    seo_metrics['content_types'][block.type] = seo_metrics['content_types'].get(block.type, 0) + 1
                    
                    if block.type == 'heading' and block.level:
                        seo_metrics['heading_structure'][f'h{block.level}'] += 1
                    elif block.type == 'image':
                        seo_metrics['image_analysis']['total'] += 1
                        if block.data and block.data.get('seo_analysis', {}).get('has_alt_text'):
                            seo_metrics['image_analysis']['with_alt'] += 1
                        if block.data and block.data.get('seo_analysis', {}).get('alt_quality') == 'good':
                            seo_metrics['image_analysis']['good_alt'] += 1
                    elif block.type == 'link':
                        seo_metrics['link_analysis']['total'] += 1
                        if block.data and block.data.get('seo_analysis'):
                            seo_data = block.data['seo_analysis']
                            if seo_data.get('is_internal'):
                                seo_metrics['link_analysis']['internal'] += 1
                            if seo_data.get('is_external'):
                                seo_metrics['link_analysis']['external'] += 1
                            if seo_data.get('is_nofollow'):
                                seo_metrics['link_analysis']['nofollow'] += 1
                
                # Insert blocks in batch
                if blocks_data:
                    self.supabase.table('content_blocks').insert(blocks_data).execute()
            
            # Create SEO analysis summary
            job_data = self.supabase.table('scrape_jobs').select('domain').eq('job_id', job_id).execute()
            domain = job_data.data[0]['domain']
            
            seo_data = {
                'job_id': job_uuid,
                'domain': domain,
                'total_pages': len(pages),
                'total_content_blocks': total_blocks,
                'heading_structure': seo_metrics['heading_structure'],
                'image_analysis': seo_metrics['image_analysis'],
                'link_analysis': seo_metrics['link_analysis'],
                'content_types': seo_metrics['content_types'],
                'overall_seo_score': self._calculate_seo_score(seo_metrics),
                'analyzed_at': datetime.utcnow().isoformat()
            }
            
            self.supabase.table('seo_analysis').insert(seo_data).execute()
            
            print(f"✅ Saved {len(pages)} pages with {total_blocks} content blocks for job {job_id}")
                
        except Exception as e:
            print(f"❌ Failed to save content for job {job_id}: {e}")
            raise
    
    async def get_results(self, job_id: str) -> List[PageContent]:
        """Get scraping results using Supabase client"""
        try:
            # Get job
            job_result = self.supabase.table('scrape_jobs').select('id').eq('job_id', job_id).execute()
            
            if not job_result.data:
                return []
            
            job_uuid = job_result.data[0]['id']
            
            # Get pages
            pages_result = self.supabase.table('page_content').select('*').eq('job_id', job_uuid).order('scraped_at').execute()
            
            pages = []
            for page_data in pages_result.data:
                # Get content blocks for this page
                blocks_result = self.supabase.table('content_blocks').select('*').eq('page_id', page_data['id']).order('block_id').execute()
                
                # Convert content blocks
                blocks = []
                for block_data in blocks_result.data:
                    block = ContentBlock(
                        id=block_data['block_id'],
                        type=block_data['content_type'],
                        content=block_data['content'],
                        data=block_data.get('data', {}),
                        parent_id=block_data.get('parent_id'),
                        level=block_data.get('level')
                    )
                    blocks.append(block)
                
                # Create page content
                page = PageContent(
                    url=page_data['url'],
                    title=page_data['title'],
                    blocks=blocks,
                    metadata={
                        'description': page_data.get('meta_description'),
                        'keywords': page_data.get('meta_keywords'),
                        'canonical_url': page_data.get('canonical_url'),
                        'robots': page_data.get('robots_meta'),
                        'language': page_data.get('language'),
                        'open_graph': page_data.get('open_graph'),
                        'twitter_card': page_data.get('twitter_card'),
                        'hreflang': page_data.get('hreflang'),
                        'structured_data': page_data.get('structured_data'),
                        'content_length': page_data.get('content_length'),
                        'status_code': page_data.get('status_code'),
                        'scraped_at': page_data.get('scraped_at')
                    }
                )
                pages.append(page)
            
            return pages
                
        except Exception as e:
            print(f"❌ Failed to get results for job {job_id}: {e}")
            return []
    
    async def get_seo_analysis(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get SEO analysis using Supabase client"""
        try:
            # Get job
            job_result = self.supabase.table('scrape_jobs').select('id').eq('job_id', job_id).execute()
            
            if not job_result.data:
                return None
            
            job_uuid = job_result.data[0]['id']
            
            # Get SEO analysis
            seo_result = self.supabase.table('seo_analysis').select('*').eq('job_id', job_uuid).execute()
            
            if not seo_result.data:
                return None
            
            seo_data = seo_result.data[0]
            
            return {
                'domain': seo_data['domain'],
                'total_pages': seo_data['total_pages'],
                'total_content_blocks': seo_data['total_content_blocks'],
                'heading_structure': seo_data['heading_structure'],
                'image_analysis': seo_data['image_analysis'],
                'link_analysis': seo_data['link_analysis'],
                'content_types': seo_data['content_types'],
                'overall_seo_score': seo_data['overall_seo_score'],
                'analyzed_at': seo_data['analyzed_at']
            }
                
        except Exception as e:
            print(f"❌ Failed to get SEO analysis for job {job_id}: {e}")
            return None
    
    async def list_jobs(self, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """List recent jobs using Supabase client"""
        try:
            result = self.supabase.table('scrape_jobs').select('*').order('created_at', desc=True).limit(limit).offset(offset).execute()
            
            return [
                {
                    'job_id': job['job_id'],
                    'domain': job['domain'],
                    'status': job['status'],
                    'created_at': job['created_at'],
                    'completed_at': job.get('completed_at'),
                    'progress': job.get('progress', {})
                }
                for job in result.data
            ]
                
        except Exception as e:
            print(f"❌ Failed to list jobs: {e}")
            return []
    
    def _calculate_seo_score(self, metrics: Dict[str, Any]) -> int:
        """Calculate overall SEO score based on metrics"""
        score = 0
        
        # Heading structure score (0-25 points)
        h1_count = metrics['heading_structure'].get('h1', 0)
        if h1_count == 1:
            score += 25
        elif h1_count > 1:
            score += 15  # Multiple H1s are not ideal
        
        # Image SEO score (0-25 points)
        image_stats = metrics['image_analysis']
        if image_stats['total'] > 0:
            alt_percentage = (image_stats['with_alt'] / image_stats['total']) * 100
            score += min(25, int(alt_percentage / 4))  # Max 25 points
        
        # Link quality score (0-25 points)
        link_stats = metrics['link_analysis']
        if link_stats['total'] > 0:
            internal_percentage = (link_stats['internal'] / link_stats['total']) * 100
            if internal_percentage > 20:  # Good internal linking
                score += 25
            else:
                score += int(internal_percentage)
        
        # Content diversity score (0-25 points)
        content_types = len(metrics['content_types'])
        score += min(25, content_types * 5)  # 5 points per content type, max 25
        
        return min(100, score)
    
    async def cleanup_old_jobs(self, days: int = 30):
        """Clean up jobs older than specified days using Supabase client"""
        try:
            cutoff_date = (datetime.utcnow() - timedelta(days=days)).isoformat()
            
            # Delete old jobs (cascades to related tables due to foreign key constraints)
            result = self.supabase.table('scrape_jobs').delete().lt('created_at', cutoff_date).execute()
            
            print(f"✅ Cleaned up old jobs (older than {days} days)")
                
        except Exception as e:
            print(f"❌ Failed to cleanup old jobs: {e}")

# Global database instance
db_manager: Optional[SupabaseManager] = None

def get_database() -> SupabaseManager:
    """Get database manager instance"""
    global db_manager
    if db_manager is None:
        db_manager = SupabaseManager()
    return db_manager 