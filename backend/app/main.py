"""
Domain Content Scraper - FastAPI Application
Main entry point for the backend API with full Scrapy integration
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks
from typing import Dict, Any
import uuid
from datetime import datetime

from .models import ScrapeRequest, ScrapeJob, ScrapeResults, JobStatus, PageContent
from .scraper import get_scraper

app = FastAPI(
    title="Domain Content Scraper",
    description="A backend service that extracts text content from domains with full Scrapy integration",
    version="1.0.0"
)

# In-memory storage for MVP (will be replaced with SQLite in Phase 4)
scrape_jobs: Dict[str, ScrapeJob] = {}
scrape_results: Dict[str, ScrapeResults] = {}

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Domain Content Scraper API is running with full Scrapy integration!"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "scrapy_integration": "active"
    }

@app.post("/scrape")
async def trigger_scrape(request: ScrapeRequest):
    """Trigger scraping for a domain with real Scrapy integration"""
    job_id = str(uuid.uuid4())
    scraper = get_scraper()
    
    # Create job
    job = ScrapeJob(
        job_id=job_id,
        domain=request.domain,
        status=JobStatus.PENDING,
        created_at=datetime.now(),
        progress={
            "pages_scraped": 0,
            "max_pages": request.max_pages,
            "percentage": 0
        }
    )
    
    # Store job
    scrape_jobs[job_id] = job
    
    # Start actual scraping with Scrapy
    success = await scraper.start_scraping(job_id, request)
    
    if success:
        job.status = JobStatus.RUNNING
        return {
            "job_id": job_id,
            "message": f"Scraping started for {request.domain}",
            "status": "running",
            "max_pages": request.max_pages
        }
    else:
        job.status = JobStatus.FAILED
        job.error_message = "Failed to start scraping"
        job.completed_at = datetime.now()
        raise HTTPException(status_code=500, detail="Failed to start scraping")

@app.get("/status/{job_id}")
async def get_scrape_status(job_id: str):
    """Get scraping status with real-time updates"""
    if job_id not in scrape_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = scrape_jobs[job_id]
    scraper = get_scraper()
    
    # Update job status from scraper
    current_status = scraper.get_job_status(job_id)
    progress = scraper.get_job_progress(job_id)
    
    # Update job object
    if current_status != job.status:
        job.status = current_status
        if current_status in [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED]:
            job.completed_at = datetime.now()
    
    # Update progress
    job.progress["percentage"] = progress
    
    return {
        "job_id": job_id,
        "domain": job.domain,
        "status": job.status.value,
        "created_at": job.created_at.isoformat(),
        "completed_at": job.completed_at.isoformat() if job.completed_at else None,
        "progress": job.progress,
        "error_message": job.error_message
    }

@app.get("/results/{job_id}")
async def get_scrape_results(job_id: str):
    """Get scraping results from completed jobs"""
    if job_id not in scrape_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = scrape_jobs[job_id]
    scraper = get_scraper()
    
    # Check if job is completed
    current_status = scraper.get_job_status(job_id)
    if current_status != JobStatus.COMPLETED:
        raise HTTPException(
            status_code=400, 
            detail=f"Job not completed yet. Current status: {current_status.value}"
        )
    
    # Update job object with current status (fix for race condition)
    if current_status != job.status:
        job.status = current_status
        if current_status in [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED]:
            job.completed_at = datetime.now()
    
    # Get results from scraper
    results = scraper.get_job_results(job_id)
    if not results:
        raise HTTPException(status_code=404, detail="Results not found")
    
    # Convert PageContent objects to dict for JSON response
    pages_data = []
    for page in results.get('pages', []):
        if hasattr(page, 'dict'):  # Pydantic model
            pages_data.append(page.dict())
        else:  # Already a dict
            pages_data.append(page)
    
    return {
        "job": {
            "job_id": job.job_id,
            "domain": job.domain,
            "status": current_status.value,  # Use current_status instead of job.status
            "created_at": job.created_at.isoformat(),
            "completed_at": job.completed_at.isoformat() if job.completed_at else None
        },
        "pages": pages_data,
        "summary": results.get('summary', {})
    }

@app.delete("/jobs/{job_id}")
async def cancel_job(job_id: str):
    """Cancel a running job"""
    if job_id not in scrape_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = scrape_jobs[job_id]
    scraper = get_scraper()
    
    # Check current status
    current_status = scraper.get_job_status(job_id)
    if current_status in [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED]:
        raise HTTPException(status_code=400, detail="Job already finished")
    
    # Cancel the scraping task
    success = await scraper.stop_scraping(job_id)
    
    if success:
        job.status = JobStatus.CANCELLED
        job.error_message = "Job cancelled by user"
        job.completed_at = datetime.now()
        return {"message": f"Job {job_id} cancelled successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to cancel job")

@app.get("/jobs")
async def list_jobs():
    """List all jobs with real-time status updates"""
    scraper = get_scraper()
    jobs = []
    
    for job_id, job in scrape_jobs.items():
        # Update status from scraper
        current_status = scraper.get_job_status(job_id)
        progress = scraper.get_job_progress(job_id)
        
        # Update job object with current status (consistency fix)
        if current_status != job.status:
            job.status = current_status
            if current_status in [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED]:
                job.completed_at = datetime.now()
        
        jobs.append({
            "job_id": job_id,
            "domain": job.domain,
            "status": current_status.value,
            "created_at": job.created_at.isoformat(),
            "progress": progress
        })
    
    return {"jobs": jobs, "total": len(jobs)}

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown"""
    scraper = get_scraper()
    # Cancel all running jobs
    for job_id in list(scraper.running_jobs.keys()):
        await scraper.stop_scraping(job_id) 