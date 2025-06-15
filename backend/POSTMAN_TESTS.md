# 🚀 Domain Content Scraper - Postman Test Collection

## Quick Setup
1. Start the server: `uvicorn app.main:app --reload --port 8000`
2. Import these curl commands into Postman or run them directly

---

## 📋 **Test Collection**

### 1. 🏥 Health Check
```bash
curl -X GET "http://localhost:8000/health" \
  -H "Accept: application/json"
```
**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-06-14T23:00:00.000000",
  "version": "1.0.0",
  "scrapy_integration": "active"
}
```

---

### 2. 🏠 Root Endpoint
```bash
curl -X GET "http://localhost:8000/" \
  -H "Accept: application/json"
```
**Expected Response:**
```json
{
  "message": "Domain Content Scraper API is running with full Scrapy integration!"
}
```

---

### 3. 🕷️ Start Scraping (Small Site)
```bash
curl -X POST "http://localhost:8000/scrape" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "domain": "example.com",
    "max_pages": 3,
    "options": {}
  }'
```
**Expected Response:**
```json
{
  "job_id": "uuid-here",
  "message": "Scraping started for example.com",
  "status": "running",
  "max_pages": 3
}
```

---

### 4. 🕷️ Start Scraping (Larger Site)
```bash
curl -X POST "http://localhost:8000/scrape" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "domain": "httpbin.org",
    "max_pages": 5,
    "options": {
      "extract_media": true,
      "include_metadata": true
    }
  }'
```

---

### 5. 📊 Check Job Status
```bash
# Replace {job_id} with actual job ID from step 3 or 4
curl -X GET "http://localhost:8000/status/{job_id}" \
  -H "Accept: application/json"
```
**Expected Response:**
```json
{
  "job_id": "uuid-here",
  "domain": "example.com",
  "status": "completed",
  "created_at": "2025-06-14T23:00:00.000000",
  "completed_at": "2025-06-14T23:00:15.000000",
  "progress": {
    "pages_scraped": 0,
    "max_pages": 3,
    "percentage": 100
  },
  "error_message": null
}
```

---

### 6. 📄 Get Scraping Results
```bash
# Replace {job_id} with actual job ID from completed job
curl -X GET "http://localhost:8000/results/{job_id}" \
  -H "Accept: application/json"
```
**Expected Response:**
```json
{
  "job": {
    "job_id": "uuid-here",
    "domain": "example.com",
    "status": "completed",
    "created_at": "2025-06-14T23:00:00.000000",
    "completed_at": "2025-06-14T23:00:15.000000"
  },
  "pages": [
    {
      "url": "https://example.com",
      "title": "Example Domain",
      "blocks": [
        {
          "id": 1,
          "type": "heading",
          "content": "Example Domain",
          "level": 1,
          "data": {
            "tag": "h1",
            "css_classes": null
          }
        },
        {
          "id": 2,
          "type": "paragraph",
          "content": "This domain is for use in illustrative examples...",
          "parent_id": 1,
          "data": {
            "word_count": 24
          }
        }
      ],
      "metadata": {
        "description": null,
        "keywords": [],
        "language": null,
        "scraped_at": "2025-06-14T23:00:10.000000",
        "status_code": 200
      }
    }
  ],
  "summary": {
    "total_pages": 2,
    "total_blocks": 8,
    "scraped_at": "2025-06-14T23:00:15.000000"
  }
}
```

---

### 7. 📋 List All Jobs
```bash
curl -X GET "http://localhost:8000/jobs" \
  -H "Accept: application/json"
```
**Expected Response:**
```json
{
  "jobs": [
    {
      "job_id": "uuid-1",
      "domain": "example.com",
      "status": "completed",
      "created_at": "2025-06-14T23:00:00.000000",
      "progress": 100
    },
    {
      "job_id": "uuid-2",
      "domain": "httpbin.org",
      "status": "running",
      "created_at": "2025-06-14T23:01:00.000000",
      "progress": 45
    }
  ],
  "total": 2
}
```

---

### 8. ❌ Cancel Running Job
```bash
# Replace {job_id} with actual job ID of a running job
curl -X DELETE "http://localhost:8000/jobs/{job_id}" \
  -H "Accept: application/json"
```
**Expected Response:**
```json
{
  "message": "Job uuid-here cancelled successfully"
}
```

---

## 🧪 **Error Testing**

### 9. ❌ Invalid Domain
```bash
curl -X POST "http://localhost:8000/scrape" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "domain": "",
    "max_pages": 5
  }'
```

### 10. ❌ Job Not Found
```bash
curl -X GET "http://localhost:8000/status/invalid-job-id" \
  -H "Accept: application/json"
```
**Expected Response:**
```json
{
  "detail": "Job not found"
}
```

### 11. ❌ Results Not Ready
```bash
# Try to get results from a running job
curl -X GET "http://localhost:8000/results/{running_job_id}" \
  -H "Accept: application/json"
```
**Expected Response:**
```json
{
  "detail": "Job not completed yet. Current status: running"
}
```

---

## 🎯 **Recommended Test Domains**

### Small & Fast (Good for Testing)
```bash
# Example.com - Simple single page
"domain": "example.com"

# HTTPBin - API testing site with multiple pages
"domain": "httpbin.org"
```

### Medium Sites (Demo Purposes)
```bash
# Python.org - Official Python website
"domain": "python.org"

# GitHub Pages - Static sites
"domain": "pages.github.com"
```

---

## 📱 **Postman Collection Import**

### Option 1: Manual Import
1. Copy each curl command
2. In Postman: Import → Raw Text → Paste curl
3. Postman auto-converts to request

### Option 2: Environment Variables
Create Postman environment with:
```json
{
  "base_url": "http://localhost:8000",
  "job_id": "{{job_id_from_previous_request}}"
}
```

Then use: `{{base_url}}/status/{{job_id}}`

---

## 🔄 **Complete Workflow Test**

### Step-by-Step Testing:
1. **Health Check** → Verify server is running
2. **Start Scraping** → Get job_id from response
3. **Check Status** → Wait for "completed" status
4. **Get Results** → Retrieve scraped content
5. **List Jobs** → Verify job appears in list

### Timing:
- Small sites (example.com): ~10-15 seconds
- Medium sites (httpbin.org): ~30-60 seconds

---

## 🚀 **Pro Tips for Postman**

1. **Save job_id**: Use Tests tab to save job_id to environment
   ```javascript
   pm.environment.set("job_id", pm.response.json().job_id);
   ```

2. **Auto-retry status**: Use Postman Runner to check status every 5 seconds

3. **Pretty JSON**: Use JSON viewer for readable results

4. **Collections**: Group related requests for easy testing

**Happy Testing! 🎉** 