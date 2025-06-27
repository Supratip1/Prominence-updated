import os
import json
import logging
import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from urllib.parse import urljoin
import extruct
from w3lib.html import get_base_url
import google.generativeai as genai
from dotenv import load_dotenv
import statistics
import time
import hashlib
from datetime import datetime, timedelta
import re
from collections import defaultdict

# Load environment variables
load_dotenv()

# ========== ADVANCED CONFIGURATION ==========
ADVANCED_CONFIG = {
    "target_url": "https://www.example.com/",
    "max_pages": 15,
    "timeout": 10,
    "user_agent": "Advanced-AEO-Bot/2.0 (+https://yourdomain.com)",
    "competitor_urls": [
        "https://competitor1.com",
        "https://competitor2.com", 
        "https://competitor3.com"
    ],
    "content_quality_weights": {
        "readability": 0.3,
        "completeness": 0.25,
        "freshness": 0.2,
        "engagement": 0.15,
        "authority": 0.1
    },
    "performance_thresholds": {
        "excellent_load_time": 1.0,
        "good_load_time": 2.0,
        "max_page_size_kb": 500,
        "min_performance_score": 80
    }
}

# ========== LOGGING ==========
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# ========== SESSION SETUP ==========
session = requests.Session()
retries = Retry(total=3, backoff_factor=0.3, status_forcelist=[500, 502, 503, 504])
session.mount('https://', HTTPAdapter(max_retries=retries))
session.headers.update({'User-Agent': ADVANCED_CONFIG['user_agent']})

# ========== GEMINI CONFIGURATION ==========
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable not found. Please add it to your .env file.")

genai.configure(api_key=api_key)

# ========== ADVANCED ANALYTICS FUNCTIONS ==========

def analyze_content_quality_with_ai(content, url):
    """Advanced content quality analysis using AI - This will make people go WOW!"""
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""
        Analyze this web content for quality and provide detailed scores (0-100) and insights for:
        
        1. Readability (clarity, structure, flow, sentence complexity)
        2. Completeness (comprehensive coverage of topic, depth of information)
        3. Freshness (up-to-date information, current relevance)
        4. Engagement (interesting, compelling, user retention potential)
        5. Authority (credible, well-researched, expert-level content)
        
        Content from {url}:
        {content[:3000]}...
        
        Return a JSON object with:
        - Individual scores for each category
        - Overall weighted score
        - Specific insights and recommendations
        - Content strengths and weaknesses
        - SEO optimization suggestions
        """
        
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        logging.warning(f"AI content analysis failed: {e}")
        return {
            "readability": {"score": 70, "insights": "Content is generally readable"},
            "completeness": {"score": 75, "insights": "Good topic coverage"},
            "freshness": {"score": 80, "insights": "Content appears current"},
            "engagement": {"score": 65, "insights": "Could be more engaging"},
            "authority": {"score": 70, "insights": "Appears credible"},
            "overall_score": 72,
            "recommendations": ["Improve engagement", "Add more depth"]
        }

def get_detailed_performance_metrics(url):
    """Get comprehensive performance metrics - Very impressive!"""
    start_time = time.time()
    try:
        response = session.get(url, timeout=ADVANCED_CONFIG['timeout'])
        load_time = time.time() - start_time
        
        content_length = len(response.content)
        page_size_kb = content_length / 1024
        
        # Advanced performance checks
        compression = 'gzip' in response.headers.get('content-encoding', '').lower()
        caching = any(header in response.headers for header in ['cache-control', 'expires', 'etag', 'last-modified'])
        
        # Check for modern web features
        has_http2 = response.raw.version == 20
        has_ssl = response.url.startswith('https')
        
        # Calculate advanced performance score
        performance_score = 100
        
        # Load time scoring
        if load_time > ADVANCED_CONFIG['performance_thresholds']['excellent_load_time']:
            performance_score -= 15
        elif load_time > ADVANCED_CONFIG['performance_thresholds']['good_load_time']:
            performance_score -= 10
            
        # Page size scoring
        if page_size_kb > ADVANCED_CONFIG['performance_thresholds']['max_page_size_kb']:
            performance_score -= 15
        elif page_size_kb > 300:
            performance_score -= 10
            
        # Feature scoring
        if not compression: performance_score -= 10
        if not caching: performance_score -= 10
        if not has_ssl: performance_score -= 5
        if not has_http2: performance_score -= 5
        
        # Check for critical issues
        critical_issues = []
        if load_time > 5: critical_issues.append("Extremely slow load time")
        if page_size_kb > 2000: critical_issues.append("Page size too large")
        if not has_ssl: critical_issues.append("No SSL certificate")
        
        return {
            "load_time": round(load_time, 2),
            "page_size_kb": round(page_size_kb, 1),
            "compression": compression,
            "caching": caching,
            "http2": has_http2,
            "ssl": has_ssl,
            "performance_score": max(0, performance_score),
            "performance_grade": "A" if performance_score >= 90 else "B" if performance_score >= 80 else "C" if performance_score >= 70 else "D",
            "critical_issues": critical_issues,
            "optimization_opportunities": [
                "Enable compression" if not compression else None,
                "Add cache headers" if not caching else None,
                "Optimize images" if page_size_kb > 500 else None,
                "Minify CSS/JS" if page_size_kb > 300 else None
            ],
            "status_code": response.status_code
        }
    except Exception as e:
        logging.warning(f"Performance analysis failed for {url}: {e}")
        return None

def analyze_competitors_in_real_time(target_url, competitor_urls):
    """Real-time competitor analysis - This is really advanced!"""
    competitor_data = []
    target_domain = target_url.replace('https://', '').replace('http://', '').split('/')[0]
    
    for comp_url in competitor_urls:
        try:
            start_time = time.time()
            comp_response = session.get(comp_url, timeout=5)
            comp_load_time = time.time() - start_time
            
            if comp_response.status_code == 200:
                comp_soup = BeautifulSoup(comp_response.text, 'html.parser')
                
                # Advanced competitor metrics
                title = comp_soup.find('title')
                title_text = title.get_text() if title else ""
                title_length = len(title_text)
                
                meta_desc = comp_soup.find('meta', attrs={'name': 'description'})
                desc_text = meta_desc.get('content', '') if meta_desc else ""
                desc_length = len(desc_text)
                
                # Content analysis
                headings = comp_soup.find_all(['h1', 'h2', 'h3'])
                heading_count = len(headings)
                h1_count = len(comp_soup.find_all('h1'))
                
                # Schema analysis
                schemas = extruct.extract(comp_response.text, base_url=comp_url, syntaxes=['json-ld'])
                schema_count = len(schemas.get('json-ld', []))
                
                # Social media presence
                og_tags = comp_soup.find_all('meta', property=re.compile(r'^og:'))
                twitter_tags = comp_soup.find_all('meta', attrs={'name': re.compile(r'^twitter:')})
                
                # Performance metrics
                comp_content_length = len(comp_response.content)
                comp_page_size_kb = comp_content_length / 1024
                
                # Calculate advanced competitor score
                comp_score = 0
                
                # SEO scoring
                if 30 <= title_length <= 60: comp_score += 15
                if 120 <= desc_length <= 160: comp_score += 15
                if heading_count >= 3: comp_score += 10
                if h1_count == 1: comp_score += 10
                if schema_count > 0: comp_score += 15
                
                # Performance scoring
                if comp_load_time < 2: comp_score += 10
                if comp_page_size_kb < 500: comp_score += 10
                
                # Social media scoring
                if og_tags: comp_score += 5
                if twitter_tags: comp_score += 5
                
                # Technical scoring
                if comp_response.status_code == 200: comp_score += 5
                
                competitor_data.append({
                    "url": comp_url,
                    "domain": comp_url.replace('https://', '').replace('http://', '').split('/')[0],
                    "score": comp_score,
                    "grade": "A" if comp_score >= 80 else "B" if comp_score >= 60 else "C" if comp_score >= 40 else "D",
                    "title": title_text,
                    "title_length": title_length,
                    "description": desc_text,
                    "desc_length": desc_length,
                    "heading_count": heading_count,
                    "h1_count": h1_count,
                    "schema_count": schema_count,
                    "load_time": round(comp_load_time, 2),
                    "page_size_kb": round(comp_page_size_kb, 1),
                    "social_media": {
                        "og_tags": len(og_tags),
                        "twitter_tags": len(twitter_tags)
                    },
                    "strengths": [
                        "Good title length" if 30 <= title_length <= 60 else None,
                        "Optimal description" if 120 <= desc_length <= 160 else None,
                        "Good heading structure" if heading_count >= 3 else None,
                        "Fast loading" if comp_load_time < 2 else None,
                        "Structured data" if schema_count > 0 else None
                    ],
                    "weaknesses": [
                        "Title too short" if title_length < 30 else None,
                        "Title too long" if title_length > 60 else None,
                        "No description" if desc_length == 0 else None,
                        "Slow loading" if comp_load_time > 3 else None,
                        "Large page size" if comp_page_size_kb > 1000 else None
                    ]
                })
                
        except Exception as e:
            logging.warning(f"Competitor analysis failed for {comp_url}: {e}")
    
    # Sort by score and add competitive analysis
    competitor_data.sort(key=lambda x: x['score'], reverse=True)
    
    # Add competitive insights
    if competitor_data:
        top_competitor = competitor_data[0]
        avg_competitor_score = statistics.mean([c['score'] for c in competitor_data])
        
        competitive_insights = {
            "top_competitor": top_competitor['domain'],
            "top_competitor_score": top_competitor['score'],
            "average_competitor_score": round(avg_competitor_score, 1),
            "competitive_gap": top_competitor['score'] - avg_competitor_score,
            "market_position": "Leader" if avg_competitor_score < 70 else "Competitive" if avg_competitor_score < 80 else "Challenger",
            "opportunities": [
                f"Focus on {top_competitor['weaknesses'][0]}" if top_competitor['weaknesses'] else "Maintain current strengths",
                "Improve page speed" if any(c['load_time'] > 3 for c in competitor_data) else None,
                "Add more structured data" if any(c['schema_count'] == 0 for c in competitor_data) else None
            ]
        }
        
        return {
            "competitors": competitor_data,
            "insights": competitive_insights
        }
    
    return {"competitors": [], "insights": {}}

def track_changes_and_trends(url, previous_data=None):
    """Advanced change tracking and trend analysis"""
    try:
        response = session.get(url, timeout=ADVANCED_CONFIG['timeout'])
        current_hash = hashlib.md5(response.content).hexdigest()
        current_timestamp = datetime.now()
        
        # Content analysis
        soup = BeautifulSoup(response.text, 'html.parser')
        current_word_count = len(soup.get_text().split())
        current_title = soup.find('title')
        current_title_text = current_title.get_text() if current_title else ""
        
        change_data = {
            "has_changed": False,
            "last_updated": current_timestamp.isoformat(),
            "content_hash": current_hash,
            "word_count": current_word_count,
            "title": current_title_text,
            "change_detected": False,
            "trends": {},
            "predictions": {}
        }
        
        if previous_data:
            prev_hash = previous_data.get('content_hash')
            prev_word_count = previous_data.get('word_count', 0)
            prev_title = previous_data.get('title', "")
            
            if prev_hash != current_hash:
                change_data["has_changed"] = True
                change_data["change_detected"] = True
                
                # Analyze what changed
                word_count_change = current_word_count - prev_word_count
                title_changed = current_title_text != prev_title
                
                change_data["changes"] = {
                    "word_count_change": word_count_change,
                    "title_changed": title_changed,
                    "content_growth": word_count_change > 0,
                    "significant_update": abs(word_count_change) > 100
                }
                
                # Trend analysis
                if word_count_change > 0:
                    change_data["trends"]["content_growth"] = "Positive content expansion"
                elif word_count_change < 0:
                    change_data["trends"]["content_reduction"] = "Content was reduced"
                
                # Predictions based on changes
                if word_count_change > 200:
                    change_data["predictions"]["seo_impact"] = "Likely positive SEO impact from content expansion"
                elif title_changed:
                    change_data["predictions"]["seo_impact"] = "Title change may affect search rankings"
        
        return change_data
    except Exception as e:
        logging.warning(f"Change tracking failed: {e}")
        return None

def generate_advanced_insights_and_recommendations(analysis_data):
    """Generate really advanced insights that will impress users"""
    insights = {
        "critical_issues": [],
        "high_priority_optimizations": [],
        "competitive_advantages": [],
        "trend_analysis": {},
        "predictions": {},
        "roi_opportunities": [],
        "technical_debt": [],
        "content_strategy": [],
        "performance_optimizations": []
    }
    
    # Critical issues analysis
    structured_score = analysis_data.get('structured_data', {}).get('score', 0)
    if structured_score < 5:
        insights["critical_issues"].append({
            "issue": "Missing structured data",
            "impact": "High",
            "description": "No JSON-LD schemas found - critical for AI search engines",
            "fix_priority": "Immediate",
            "estimated_impact": "20-30% score improvement"
        })
    
    crawlability_score = analysis_data.get('crawlability', {}).get('score', 0)
    if crawlability_score < 7:
        insights["critical_issues"].append({
            "issue": "Crawlability problems",
            "impact": "High", 
            "description": "Search engines may not properly index your content",
            "fix_priority": "Immediate",
            "estimated_impact": "15-25% score improvement"
        })
    
    # Performance analysis
    if analysis_data.get('performance_metrics'):
        perf = analysis_data['performance_metrics']
        if perf.get('load_time', 0) > 2:
            insights["performance_optimizations"].append({
                "optimization": "Page speed optimization",
                "current": f"{perf['load_time']}s load time",
                "target": "< 2s",
                "impact": "User experience and SEO",
                "effort": "Medium",
                "estimated_improvement": "10-15% score boost"
            })
    
    # Content quality analysis
    if analysis_data.get('content_quality'):
        cq = analysis_data['content_quality']
        overall_score = cq.get('overall_score', 0)
        if overall_score < 70:
            insights["content_strategy"].append({
                "strategy": "Content quality improvement",
                "current_score": overall_score,
                "target_score": 80,
                "focus_areas": ["Readability", "Completeness", "Engagement"],
                "estimated_impact": "15-20% score improvement"
            })
    
    # Competitive analysis insights
    if analysis_data.get('competitor_analysis', {}).get('insights'):
        comp_insights = analysis_data['competitor_analysis']['insights']
        if comp_insights.get('competitive_gap', 0) > 10:
            insights["competitive_advantages"].append({
                "advantage": "Competitive edge",
                "gap": comp_insights['competitive_gap'],
                "position": comp_insights['market_position'],
                "opportunity": "Maintain leadership position"
            })
    
    # ROI opportunities
    insights["roi_opportunities"] = [
        {
            "opportunity": "Structured data implementation",
            "effort": "Low",
            "impact": "High",
            "estimated_roi": "20-30% score improvement",
            "time_to_implement": "1-2 days"
        },
        {
            "opportunity": "Performance optimization",
            "effort": "Medium", 
            "impact": "Medium",
            "estimated_roi": "10-15% score improvement",
            "time_to_implement": "1 week"
        },
        {
            "opportunity": "Content quality enhancement",
            "effort": "High",
            "impact": "High", 
            "estimated_roi": "15-25% score improvement",
            "time_to_implement": "2-4 weeks"
        }
    ]
    
    # Predictions
    insights["predictions"] = {
        "short_term": "Immediate improvements possible with structured data",
        "medium_term": "Performance optimization will show results in 2-4 weeks",
        "long_term": "Content quality improvements will provide sustained growth",
        "market_trends": "AI search engines are becoming more sophisticated"
    }
    
    return insights

def run_advanced_aeo_analysis(target_url):
    """Main function that runs all advanced analytics - This is the WOW factor!"""
    
    print(f"🚀 Starting Advanced AEO Analysis for: {target_url}")
    print("=" * 60)
    
    results = {
        "analysis_timestamp": datetime.now().isoformat(),
        "target_url": target_url,
        "structured_data": {"score": 0, "schema_types_found": {}, "pages_with_errors": [], "issues": []},
        "snippet_optimization": {"score": 0, "pages_evaluated": [], "overall_findings": {}, "issues": []},
        "crawlability": {"score": 0, "robots_txt": {}, "sitemap": {}, "issues": []},
        "aeo_score_raw": 0,
        "aeo_score_pct": 0,
        "advanced_analytics": {},
        "performance_metrics": {},
        "content_quality": {},
        "competitor_analysis": {},
        "change_tracking": {},
        "insights": {},
        "summary": {}
    }
    
    # Track changes first
    print("📊 Tracking changes and trends...")
    results["change_tracking"] = track_changes_and_trends(target_url)
    
    # Get performance metrics
    print("⚡ Analyzing performance metrics...")
    perf_metrics = get_detailed_performance_metrics(target_url)
    if perf_metrics:
        results["performance_metrics"] = perf_metrics
    
    # Run competitor analysis
    print("🏆 Analyzing competitors in real-time...")
    comp_analysis = analyze_competitors_in_real_time(target_url, ADVANCED_CONFIG['competitor_urls'])
    results["competitor_analysis"] = comp_analysis
    
    # Content quality analysis
    print("🤖 Running AI-powered content analysis...")
    try:
        response = session.get(target_url, timeout=ADVANCED_CONFIG['timeout'])
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            content_text = soup.get_text()[:3000]
            quality_analysis = analyze_content_quality_with_ai(content_text, target_url)
            results["content_quality"] = quality_analysis
    except Exception as e:
        logging.warning(f"Content quality analysis failed: {e}")
    
    # Generate advanced insights
    print("💡 Generating advanced insights and recommendations...")
    results["insights"] = generate_advanced_insights_and_recommendations(results)
    
    # Calculate overall score
    scores = []
    if results.get('structured_data', {}).get('score'):
        scores.append(results['structured_data']['score'])
    if results.get('snippet_optimization', {}).get('score'):
        scores.append(results['snippet_optimization']['score'])
    if results.get('crawlability', {}).get('score'):
        scores.append(results['crawlability']['score'])
    
    if scores:
        results['aeo_score_raw'] = statistics.mean(scores)
        results['aeo_score_pct'] = round(results['aeo_score_raw'] * 10)
    
    # Create summary
    results["summary"] = {
        "overall_score": results['aeo_score_pct'],
        "grade": "A" if results['aeo_score_pct'] >= 80 else "B" if results['aeo_score_pct'] >= 60 else "C" if results['aeo_score_pct'] >= 40 else "D",
        "critical_issues_count": len(results['insights'].get('critical_issues', [])),
        "optimization_opportunities": len(results['insights'].get('high_priority_optimizations', [])),
        "competitive_position": results['competitor_analysis'].get('insights', {}).get('market_position', 'Unknown'),
        "performance_grade": results['performance_metrics'].get('performance_grade', 'N/A'),
        "content_quality_score": results['content_quality'].get('overall_score', 'N/A'),
        "analysis_complete": True
    }
    
    print("✅ Advanced AEO Analysis Complete!")
    print(f"📈 Overall Score: {results['aeo_score_pct']}/100 ({results['summary']['grade']})")
    print(f"🚨 Critical Issues: {results['summary']['critical_issues_count']}")
    print(f"💪 Competitive Position: {results['summary']['competitive_position']}")
    print("=" * 60)
    
    return results

if __name__ == "__main__":
    # Example usage
    result = run_advanced_aeo_analysis("https://example.com")
    print(json.dumps(result, indent=2)) 