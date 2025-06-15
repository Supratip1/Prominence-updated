"""
Domain Content Scraper - FastAPI Application with Supabase PostgreSQL
Main entry point for the backend API with full Scrapy integration and database persistence
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from typing import Dict, Any
import uuid
from datetime import datetime, timedelta

from .models import ScrapeRequest, ScrapeJob, ScrapeResults, JobStatus, PageContent
from .scraper import get_scraper
from .supabase_db import get_database, SupabaseManager

app = FastAPI(
    title="Domain Content Scraper with Supabase",
    description="A backend service that extracts text content from domains with full SEO analysis and PostgreSQL persistence",
    version="2.0.0"
)

# Database dependency
async def get_db() -> SupabaseManager:
    return get_database()

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        db = get_database()
        await db.init_database()
        print("🚀 Application started with Supabase PostgreSQL")
    except Exception as e:
        print(f"❌ Failed to initialize database: {e}")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Domain Content Scraper API with Supabase PostgreSQL",
        "version": "2.0.0",
        "database": "Supabase PostgreSQL",
        "features": ["SEO Analysis", "Content Extraction", "Database Persistence"]
    }

@app.get("/health")
async def health_check(db: SupabaseManager = Depends(get_db)):
    """Comprehensive health check"""
    try:
        # Test database connection
        await db.list_jobs(limit=1)
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "database": db_status,
        "scrapy_integration": "active"
    }

@app.post("/scrape")
async def trigger_scrape(request: ScrapeRequest, db: SupabaseManager = Depends(get_db)):
    """Trigger scraping for a domain with database persistence"""
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
    
    # Save job to database
    try:
        await db.create_job(job)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create job in database: {str(e)}")
    
    # Start actual scraping with Scrapy
    success = await scraper.start_scraping(job_id, request)
    
    if success:
        await db.update_job_status(job_id, JobStatus.RUNNING)
        return {
            "job_id": job_id,
            "message": f"Scraping started for {request.domain}",
            "status": "running",
            "max_pages": request.max_pages,
            "database": "supabase"
        }
    else:
        await db.update_job_status(job_id, JobStatus.FAILED, error_message="Failed to start scraping")
        raise HTTPException(status_code=500, detail="Failed to start scraping")

@app.get("/status/{job_id}")
async def get_scrape_status(job_id: str, db: SupabaseManager = Depends(get_db)):
    """Get scraping status with real-time updates from database"""
    # Get job from database
    job = await db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    scraper = get_scraper()
    
    # Update job status from scraper
    current_status = scraper.get_job_status(job_id)
    progress = scraper.get_job_progress(job_id)
    
    # Update database if status changed
    if current_status != job.status:
        await db.update_job_status(job_id, current_status)
        job.status = current_status
    
    # Update progress in database
    if progress != job.progress.get("percentage", 0):
        updated_progress = job.progress.copy()
        updated_progress["percentage"] = progress
        await db.update_job_status(job_id, current_status, progress=updated_progress)
    
    return {
        "job_id": job_id,
        "domain": job.domain,
        "status": current_status.value,
        "created_at": job.created_at.isoformat(),
        "completed_at": job.completed_at.isoformat() if job.completed_at else None,
        "progress": {
            **job.progress,
            "percentage": progress
        },
        "error_message": job.error_message
    }

@app.get("/results/{job_id}")
async def get_scrape_results(job_id: str, db: SupabaseManager = Depends(get_db)):
    """Get scraping results from database"""
    # Get job from database
    job = await db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    scraper = get_scraper()
    current_status = scraper.get_job_status(job_id)
    
    # Check if job is completed
    if current_status != JobStatus.COMPLETED:
        raise HTTPException(
            status_code=400, 
            detail=f"Job not completed yet. Current status: {current_status.value}"
        )
    
    # Get results from database first
    pages = await db.get_results(job_id)
    
    # If no results in database but job is completed, save results from scraper
    if not pages:
        print(f"🔄 No results in database for job {job_id}, attempting to save from scraper...")
        scraper_results = scraper.get_job_results(job_id)
        if scraper_results and 'pages' in scraper_results:
            print(f"📊 Found {len(scraper_results['pages'])} pages in scraper, saving to database...")
            await db.save_content(job_id, scraper_results['pages'])
            await db.update_job_status(job_id, JobStatus.COMPLETED)
            # Get results again after saving
            pages = await db.get_results(job_id)
        else:
            print(f"❌ No results found in scraper for job {job_id}")
    
    if not pages:
        raise HTTPException(status_code=404, detail="Results not found")
    
    # Convert PageContent objects to dict for JSON response
    pages_data = []
    for page in pages:
        if hasattr(page, 'dict'):  # Pydantic model
            pages_data.append(page.dict())
        else:  # Already a dict
            pages_data.append(page)
    
    return {
        "job": {
            "job_id": job.job_id,
            "domain": job.domain,
            "status": current_status.value,
            "created_at": job.created_at.isoformat(),
            "completed_at": job.completed_at.isoformat() if job.completed_at else None
        },
        "pages": pages_data,
        "summary": {
            "total_pages": len(pages),
            "total_blocks": sum(len(page.blocks) for page in pages),
            "source": "supabase_database"
        }
    }

@app.get("/seo-analysis/{job_id}")
async def get_seo_analysis(job_id: str, db: SupabaseManager = Depends(get_db)):
    """Get comprehensive SEO analysis for a completed job"""
    # Check if job exists
    job = await db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Get SEO analysis
    seo_analysis = await db.get_seo_analysis(job_id)
    if not seo_analysis:
        raise HTTPException(status_code=404, detail="SEO analysis not found. Job may not be completed.")
    
    return {
        "job_id": job_id,
        "seo_analysis": seo_analysis
    }

@app.delete("/jobs/{job_id}")
async def cancel_job(job_id: str, db: SupabaseManager = Depends(get_db)):
    """Cancel a running job"""
    # Get job from database
    job = await db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    scraper = get_scraper()
    current_status = scraper.get_job_status(job_id)
    
    if current_status in [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED]:
        raise HTTPException(status_code=400, detail="Job already finished")
    
    # Cancel the scraping task
    success = await scraper.stop_scraping(job_id)
    
    if success:
        await db.update_job_status(job_id, JobStatus.CANCELLED, error_message="Job cancelled by user")
        return {"message": f"Job {job_id} cancelled successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to cancel job")

@app.get("/jobs")
async def list_jobs(limit: int = 50, offset: int = 0, db: SupabaseManager = Depends(get_db)):
    """List all jobs from database with pagination"""
    try:
        jobs = await db.list_jobs(limit=limit, offset=offset)
        return {
            "jobs": jobs,
            "total": len(jobs),
            "limit": limit,
            "offset": offset,
            "source": "supabase_database"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list jobs: {str(e)}")

@app.get("/analytics/domain/{domain}")
async def get_domain_analytics(domain: str, db: SupabaseManager = Depends(get_db)):
    """Get analytics for a specific domain"""
    try:
        # This would require additional database queries
        # For now, return a placeholder
        return {
            "domain": domain,
            "message": "Domain analytics endpoint - to be implemented",
            "suggestion": "Use /seo-analysis/{job_id} for detailed SEO analysis"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get domain analytics: {str(e)}")

@app.post("/admin/cleanup")
async def cleanup_old_jobs(days: int = 30, db: SupabaseManager = Depends(get_db)):
    """Admin endpoint to cleanup old jobs"""
    try:
        await db.cleanup_old_jobs(days=days)
        return {
            "message": f"Cleanup completed for jobs older than {days} days",
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown"""
    scraper = get_scraper()
    # Cancel all running jobs
    for job_id in list(scraper.running_jobs.keys()):
        await scraper.stop_scraping(job_id)
    print("🛑 Application shutdown complete") 