# 🚀 Supabase PostgreSQL Integration Setup

This guide will help you set up Supabase PostgreSQL as the backend database for your Domain Content Scraper.

## 📋 Prerequisites

- Supabase account (free tier available)
- Python 3.8+ with virtual environment
- Domain Content Scraper project

## 🔧 Step 1: Create Supabase Project

1. **Sign up/Login to Supabase**
   - Go to [supabase.com](https://supabase.com)
   - Create account or login

2. **Create New Project**
   - Click "New Project"
   - Choose organization
   - Enter project name: `domain-content-scraper`
   - Enter database password (save this!)
   - Select region closest to you
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll see a dashboard when ready

## 🔑 Step 2: Get Supabase Credentials

1. **Go to Project Settings**
   - Click the gear icon (⚙️) in sidebar
   - Go to "API" section

2. **Copy Required Values**
   ```
   Project URL: https://your-project-id.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Get Database URL**
   - Go to "Database" section in settings
   - Copy the connection string:
   ```
   postgresql://postgres:your_password@db.your_project_id.supabase.co:5432/postgres
   ```

## 📝 Step 3: Configure Environment

1. **Create .env file**
   ```bash
   cp env.example .env
   ```

2. **Edit .env with your credentials**
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your_anon_key_here
   SUPABASE_SERVICE_KEY=your_service_role_key_here

   # Database Configuration
   DATABASE_URL=postgresql://postgres:your_password@db.your_project_id.supabase.co:5432/postgres

   # Application Configuration
   ENVIRONMENT=development
   DEBUG=true
   ```

## 🗄️ Step 4: Run Database Migration

1. **Install Dependencies** (if not already done)
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Migration Script**
   ```bash
   python migrate_db.py
   ```

   You should see:
   ```
   🚀 Starting database migration...
   ✅ Database tables created successfully
   📊 Created tables:
      - scrape_jobs (job management)
      - page_content (scraped pages)
      - content_blocks (individual content elements)
      - seo_analysis (SEO analysis summaries)
   🎉 Your Supabase database is ready!
   ```

## 🚀 Step 5: Start the Application

1. **Start FastAPI Server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Test Database Connection**
   ```bash
   curl http://localhost:8000/health
   ```

   Should return:
   ```json
   {
     "status": "healthy",
     "database": "healthy",
     "version": "2.0.0"
   }
   ```

## 📊 Step 6: Verify in Supabase Dashboard

1. **Go to Table Editor**
   - In Supabase dashboard, click "Table Editor"
   - You should see 4 tables created:
     - `scrape_jobs`
     - `page_content` 
     - `content_blocks`
     - `seo_analysis`

2. **Test with a Scrape Job**
   ```bash
   curl -X POST "http://localhost:8000/scrape" \
        -H "Content-Type: application/json" \
        -d '{"domain": "example.com", "max_pages": 1}'
   ```

3. **Check Database**
   - Refresh Table Editor
   - You should see data in `scrape_jobs` table

## 🔍 New API Endpoints

With Supabase integration, you get these new endpoints:

### **SEO Analysis**
```bash
GET /seo-analysis/{job_id}
```
Returns comprehensive SEO analysis with scores and recommendations.

### **Enhanced Job Listing**
```bash
GET /jobs?limit=20&offset=0
```
Paginated job listing from database.

### **Admin Cleanup**
```bash
POST /admin/cleanup?days=30
```
Clean up old jobs and data.

## 🎯 Database Schema

### **scrape_jobs**
- `id` (UUID, Primary Key)
- `job_id` (String, Unique)
- `domain` (String)
- `status` (String)
- `created_at`, `completed_at` (Timestamps)
- `progress` (JSON)
- `error_message` (Text)

### **page_content**
- `id` (UUID, Primary Key)
- `job_id` (Foreign Key)
- `url`, `title` (Text)
- `meta_description`, `canonical_url` (SEO fields)
- `open_graph`, `twitter_card` (JSON, Social SEO)
- `structured_data` (JSON, Schema.org)

### **content_blocks**
- `id` (UUID, Primary Key)
- `page_id` (Foreign Key)
- `block_id` (Integer, Sequential)
- `content_type` (String: heading, paragraph, image, etc.)
- `content` (Text)
- `data` (JSON, Flexible storage)
- `seo_analysis` (JSON, SEO metrics)

### **seo_analysis**
- `id` (UUID, Primary Key)
- `job_id` (Foreign Key)
- `domain` (String)
- `overall_seo_score` (Integer, 0-100)
- `heading_structure`, `image_analysis`, `link_analysis` (JSON)

## 🛠️ Troubleshooting

### **Connection Issues**
```bash
# Test direct database connection
python -c "
import asyncio
from app.supabase_db import get_database
async def test():
    db = get_database()
    jobs = await db.list_jobs(limit=1)
    print('✅ Database connection successful')
asyncio.run(test())
"
```

### **Environment Variables**
```bash
# Check if variables are loaded
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('SUPABASE_URL:', os.getenv('SUPABASE_URL')[:20] + '...')
print('DATABASE_URL:', os.getenv('DATABASE_URL')[:30] + '...')
"
```

### **Table Creation Issues**
- Check Supabase dashboard for error logs
- Verify database password is correct
- Ensure your IP is allowed (Supabase allows all by default)

## 🎉 Success!

Your Domain Content Scraper now has:
- ✅ **Persistent Storage** - All data saved to PostgreSQL
- ✅ **SEO Analysis** - Comprehensive SEO scoring and recommendations  
- ✅ **Scalability** - Handle thousands of scraping jobs
- ✅ **Analytics** - Track performance and usage over time
- ✅ **Production Ready** - Enterprise-grade database backend

Perfect for your hackathon demo! 🚀 