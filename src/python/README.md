# AEO Analysis Integration

This project integrates Answer Engine Optimization (AEO) analysis into your React web app using a Python backend with Gemini AI.

## 🚀 Quick Start

### 1. Backend Setup

#### Install Dependencies
```bash
cd src/python
pip install -r requirements.txt
```

#### Set up Environment Variables
Create a `.env` file in the project root with your Gemini API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

#### Get a Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Paste it in your `.env` file

#### Start the Backend Server
```bash
cd src/python
python start_server.py
```

The server will be available at:
- **API Server**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### 2. Frontend Setup

#### Start the React Development Server
```bash
# In a new terminal, from the project root
npm run dev
```

The frontend will be available at http://localhost:5173

## 🎯 How It Works

### User Flow
1. User visits the dashboard and clicks "Try Beta"
2. Frontend calls the backend API with a target URL
3. Backend runs the AEO analysis using the Python script
4. Gemini AI generates optimization recommendations
5. Results are displayed on a dedicated analysis page

### API Endpoints

#### POST /analyze
Analyzes a website for AEO optimization

**Request:**
```json
{
  "url": "https://example.com",
  "max_pages": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "audit_report": {
      "aeo_score_pct": 75.5,
      "structured_data": { ... },
      "snippet_optimization": { ... },
      "crawlability": { ... }
    },
    "optimization_recommendations": {
      "optimizations": [
        {
          "description": "Add FAQ schema markup",
          "impact_level": "High",
          "category": "Structured Data"
        }
      ]
    }
  }
}
```

## 📁 Project Structure

```
src/
├── python/
│   ├── aeo_analysis.py          # Main AEO analysis script
│   ├── api_server.py            # FastAPI server
│   ├── start_server.py          # Server startup script
│   ├── requirements.txt         # Python dependencies
│   └── README.md               # This file
├── services/
│   └── aeoApi.ts               # Frontend API service
├── pages/
│   ├── Dashboard.tsx           # Main dashboard with Try Beta button
│   └── AEOAnalysis.tsx         # Results display page
└── App.tsx                     # React router configuration
```

## 🔧 Configuration

### Backend Configuration
Modify the `CONFIG` dictionary in `aeo_analysis.py` to:
- Change default target URL
- Adjust number of pages to analyze
- Modify timeout settings
- Update snippet optimization thresholds

### Frontend Configuration
Update `src/services/aeoApi.ts` to:
- Change API base URL
- Modify request/response handling
- Add custom error handling

## 🐛 Troubleshooting

### Common Issues

1. **"AEO analysis server is not running"**
   - Make sure you've started the backend server with `python start_server.py`
   - Check that the server is running on http://localhost:8000

2. **"GEMINI_API_KEY environment variable not found"**
   - Ensure your `.env` file exists in the project root
   - Verify the API key is correctly set

3. **CORS errors**
   - The backend is configured to allow requests from localhost:5173 and localhost:3000
   - If using a different port, update the CORS configuration in `api_server.py`

4. **Analysis takes too long**
   - Reduce `max_pages` in the analysis request
   - Check your internet connection
   - Verify the target website is accessible

## 🚀 Deployment

### Backend Deployment
- Deploy the Python backend to a cloud service (Heroku, Railway, etc.)
- Set environment variables on the deployment platform
- Update the frontend API base URL

### Frontend Deployment
- Build the React app with `npm run build`
- Deploy to Vercel, Netlify, or your preferred hosting service
- Update the API base URL to point to your deployed backend

## 📊 Features

- **Real-time AEO Analysis**: Analyze websites for AI search optimization
- **AI-Powered Recommendations**: Get intelligent suggestions from Gemini AI
- **Comprehensive Scoring**: Structured data, snippet optimization, and crawlability scores
- **Beautiful UI**: Modern, responsive interface for results display
- **Error Handling**: Robust error handling and user feedback
- **API Documentation**: Auto-generated API docs with FastAPI 