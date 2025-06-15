"""
Scrapy Settings for Domain Content Scraper
Updated for our universal model approach
"""

# Scrapy project name
BOT_NAME = 'domain_scraper'

# Spider modules
SPIDER_MODULES = ['scrapy_project.spiders']
NEWSPIDER_MODULE = 'scrapy_project.spiders'

# Obey robots.txt rules
ROBOTSTXT_OBEY = True

# Configure user agent
USER_AGENT = 'domain_scraper (+http://www.yourdomain.com/contact)'

# Configure delays for requests (be respectful)
DOWNLOAD_DELAY = 1  # 1 second delay between requests
RANDOMIZE_DOWNLOAD_DELAY = 0.5  # 0.5 * to 1.5 * DOWNLOAD_DELAY

# Configure concurrent requests
CONCURRENT_REQUESTS = 8
CONCURRENT_REQUESTS_PER_DOMAIN = 2

# Configure item pipelines (updated for universal model)
ITEM_PIPELINES = {
    'scrapy_project.pipelines.ValidationPipeline': 100,
    'scrapy_project.pipelines.ContentBlockPipeline': 200,
    'scrapy_project.pipelines.JsonOutputPipeline': 300,
}

# Configure AutoThrottle for automatic request throttling
AUTOTHROTTLE_ENABLED = True
AUTOTHROTTLE_START_DELAY = 1
AUTOTHROTTLE_MAX_DELAY = 60
AUTOTHROTTLE_TARGET_CONCURRENCY = 2.0
AUTOTHROTTLE_DEBUG = False

# Configure caching (helpful for development)
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 3600  # 1 hour
HTTPCACHE_DIR = 'httpcache'

# Configure logging
LOG_LEVEL = 'INFO'
LOG_FILE = 'scrapy.log'

# Configure request timeout
DOWNLOAD_TIMEOUT = 30

# Configure retry settings
RETRY_TIMES = 3
RETRY_HTTP_CODES = [500, 502, 503, 504, 408, 429]

# Configure depth limit (prevent infinite crawling)
DEPTH_LIMIT = 5

# Configure size limits
DOWNLOAD_MAXSIZE = 1073741824  # 1GB
DOWNLOAD_WARNSIZE = 33554432   # 32MB

# Configure duplicate filter
DUPEFILTER_CLASS = 'scrapy.dupefilters.RFPDupeFilter'

# Configure stats collection
STATS_CLASS = 'scrapy.statscollectors.MemoryStatsCollector'

# Configure telnet console (useful for debugging)
TELNETCONSOLE_ENABLED = True

# Configure extensions
EXTENSIONS = {
    'scrapy.extensions.telnet.TelnetConsole': None,
    'scrapy.extensions.closespider.CloseSpider': 500,
}

# Configure close spider conditions
CLOSESPIDER_TIMEOUT = 3600  # 1 hour max
CLOSESPIDER_ITEMCOUNT = 1000  # Max 1000 items per spider run
CLOSESPIDER_PAGECOUNT = 500   # Max 500 pages per spider run

# Configure feed exports (for testing)
FEEDS = {
    'scraped_data.json': {
        'format': 'json',
        'encoding': 'utf8',
        'store_empty': False,
        'indent': 2,
    },
}

# Request fingerprinting implementation
REQUEST_FINGERPRINTER_IMPLEMENTATION = '2.7'

# Twisted reactor
TWISTED_REACTOR = 'twisted.internet.asyncioreactor.AsyncioSelectorReactor' 