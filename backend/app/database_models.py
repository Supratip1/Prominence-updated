"""
SQLAlchemy Database Models for Supabase PostgreSQL
Defines the database schema for our domain content scraper
"""
from sqlalchemy import Column, String, Text, Integer, DateTime, JSON, Boolean, ForeignKey, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

Base = declarative_base()

class ScrapeJobDB(Base):
    """Database model for scrape jobs"""
    __tablename__ = 'scrape_jobs'
    
    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(String(255), unique=True, nullable=False, index=True)
    
    # Job details
    domain = Column(String(255), nullable=False, index=True)
    max_pages = Column(Integer, default=50)
    status = Column(String(50), nullable=False, default='pending', index=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Progress and results
    progress = Column(JSON, default={})
    error_message = Column(Text, nullable=True)
    
    # Metadata
    user_agent = Column(String(500), nullable=True)
    ip_address = Column(String(45), nullable=True)
    
    # Relationships
    pages = relationship("PageContentDB", back_populates="job", cascade="all, delete-orphan")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_scrape_jobs_domain_status', 'domain', 'status'),
        Index('idx_scrape_jobs_created_at', 'created_at'),
    )

class PageContentDB(Base):
    """Database model for scraped page content"""
    __tablename__ = 'page_content'
    
    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Foreign key to scrape job
    job_id = Column(UUID(as_uuid=True), ForeignKey('scrape_jobs.id'), nullable=False, index=True)
    
    # Page details
    url = Column(Text, nullable=False, index=True)
    title = Column(Text, nullable=True)
    
    # SEO Metadata (comprehensive)
    meta_description = Column(Text, nullable=True)
    meta_keywords = Column(JSON, nullable=True)  # Array of keywords
    canonical_url = Column(Text, nullable=True)
    robots_meta = Column(String(255), nullable=True)
    language = Column(String(10), nullable=True)
    
    # Social Media SEO
    open_graph = Column(JSON, nullable=True)  # OG tags
    twitter_card = Column(JSON, nullable=True)  # Twitter card data
    
    # Technical SEO
    hreflang = Column(JSON, nullable=True)  # Hreflang tags
    structured_data = Column(JSON, nullable=True)  # Schema.org data
    
    # Page metrics
    content_length = Column(Integer, nullable=True)
    load_time = Column(Integer, nullable=True)  # milliseconds
    status_code = Column(Integer, nullable=True)
    
    # Timestamps
    scraped_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    job = relationship("ScrapeJobDB", back_populates="pages")
    content_blocks = relationship("ContentBlockDB", back_populates="page", cascade="all, delete-orphan")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_page_content_url', 'url'),
        Index('idx_page_content_job_id', 'job_id'),
        Index('idx_page_content_scraped_at', 'scraped_at'),
    )

class ContentBlockDB(Base):
    """Database model for individual content blocks"""
    __tablename__ = 'content_blocks'
    
    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Foreign key to page
    page_id = Column(UUID(as_uuid=True), ForeignKey('page_content.id'), nullable=False, index=True)
    
    # Content block details
    block_id = Column(Integer, nullable=False)  # Sequential ID within page
    content_type = Column(String(50), nullable=False, index=True)
    content = Column(Text, nullable=False)
    
    # Hierarchy and structure
    parent_id = Column(Integer, nullable=True)  # Reference to parent block
    level = Column(Integer, nullable=True)  # For headings (1-6)
    
    # Flexible data storage (JSON)
    data = Column(JSON, nullable=True)
    
    # SEO analysis results
    seo_analysis = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    page = relationship("PageContentDB", back_populates="content_blocks")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_content_blocks_page_id', 'page_id'),
        Index('idx_content_blocks_type', 'content_type'),
        Index('idx_content_blocks_page_block', 'page_id', 'block_id'),
    )

class SEOAnalysisDB(Base):
    """Database model for SEO analysis summaries"""
    __tablename__ = 'seo_analysis'
    
    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Foreign key to scrape job
    job_id = Column(UUID(as_uuid=True), ForeignKey('scrape_jobs.id'), nullable=False, index=True)
    
    # Domain-level SEO metrics
    domain = Column(String(255), nullable=False, index=True)
    total_pages = Column(Integer, default=0)
    total_content_blocks = Column(Integer, default=0)
    
    # Content analysis
    heading_structure = Column(JSON, nullable=True)  # H1-H6 counts
    image_analysis = Column(JSON, nullable=True)     # Alt text stats
    link_analysis = Column(JSON, nullable=True)      # Internal/external link stats
    content_types = Column(JSON, nullable=True)      # Content type distribution
    
    # SEO scores (0-100)
    overall_seo_score = Column(Integer, nullable=True)
    content_score = Column(Integer, nullable=True)
    technical_score = Column(Integer, nullable=True)
    social_score = Column(Integer, nullable=True)
    
    # Issues and recommendations
    seo_issues = Column(JSON, nullable=True)         # Array of issues found
    recommendations = Column(JSON, nullable=True)    # Array of recommendations
    
    # Timestamps
    analyzed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    job = relationship("ScrapeJobDB")
    
    # Indexes
    __table_args__ = (
        Index('idx_seo_analysis_domain', 'domain'),
        Index('idx_seo_analysis_job_id', 'job_id'),
        Index('idx_seo_analysis_score', 'overall_seo_score'),
    ) 