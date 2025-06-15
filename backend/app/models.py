"""
Simple Universal Model for Domain Content Scraper
One flexible model that can represent any content type
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum

class JobStatus(str, Enum):
    """Job statuses"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class ContentBlock(BaseModel):
    """Universal content block - handles everything!"""
    
    # Core identification
    id: int = Field(..., description="Sequential ID for order")
    type: str = Field(..., description="Content type: text, heading, image, video, etc.")
    content: str = Field(..., description="Main content/text")
    
    # Flexible data storage - THIS IS THE KEY!
    data: Dict[str, Any] = Field(
        default={}, 
        description="Flexible storage for any additional data"
    )
    
    # Simple hierarchy
    parent_id: Optional[int] = None
    level: Optional[int] = None  # For headings (1-6) or nesting levels
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "type": "heading",
                "content": "Welcome to AI Blog",
                "level": 1,
                "data": {
                    "tag": "h1",
                    "css_classes": ["main-title"]
                }
            }
        }

class PageContent(BaseModel):
    """Simple page content model"""
    url: str
    title: Optional[str] = None
    blocks: List[ContentBlock] = Field(default=[], description="All content blocks in order")
    metadata: Dict[str, Any] = Field(default={}, description="Page metadata")
    
    class Config:
        json_schema_extra = {
            "example": {
                "url": "https://example.com/blog",
                "title": "AI Blog Post",
                "blocks": [
                    {
                        "id": 1,
                        "type": "heading",
                        "content": "AI in 2024",
                        "level": 1,
                        "data": {"tag": "h1"}
                    },
                    {
                        "id": 2,
                        "type": "paragraph",
                        "content": "Artificial intelligence is evolving rapidly...",
                        "parent_id": 1,
                        "data": {"word_count": 45}
                    },
                    {
                        "id": 3,
                        "type": "image",
                        "content": "AI Growth Chart",
                        "parent_id": 1,
                        "data": {
                            "src": "https://example.com/chart.jpg",
                            "alt": "AI Growth Chart",
                            "width": 800,
                            "height": 600,
                            "file_size": 125000
                        }
                    },
                    {
                        "id": 4,
                        "type": "video",
                        "content": "AI Demo Video",
                        "data": {
                            "src": "https://example.com/demo.mp4",
                            "duration": 120.5,
                            "thumbnail": "https://example.com/thumb.jpg"
                        }
                    }
                ],
                "metadata": {
                    "description": "A comprehensive look at AI in 2024",
                    "keywords": ["AI", "machine learning", "2024"],
                    "load_time": 1.2,
                    "total_blocks": 4,
                    "media_count": 2
                }
            }
        }

class ScrapeRequest(BaseModel):
    """Request model"""
    domain: str = Field(..., description="Domain to scrape")
    max_pages: int = Field(default=50, ge=1, le=500)
    options: Dict[str, Any] = Field(
        default={}, 
        description="Flexible options: extract_media, include_metadata, etc."
    )

class ScrapeJob(BaseModel):
    """Job tracking"""
    job_id: str
    domain: str
    status: JobStatus
    created_at: datetime
    completed_at: Optional[datetime] = None
    progress: Dict[str, Any] = Field(default={}, description="Progress info")
    error_message: Optional[str] = None

class ScrapeResults(BaseModel):
    """Complete results"""
    job: ScrapeJob
    pages: List[PageContent] = []
    summary: Dict[str, Any] = Field(default={}, description="Overall statistics") 