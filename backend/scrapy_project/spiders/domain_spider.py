"""
Universal Domain Spider
Extracts content using our universal ContentBlock model
"""
import scrapy
from urllib.parse import urljoin, urlparse
from scrapy_project.items import UniversalContentItem, PageMetadataItem
import re
from datetime import datetime

class DomainSpider(scrapy.Spider):
    """Universal spider that works with our ContentBlock model"""
    
    name = 'domain_spider'
    custom_settings = {
        'DEPTH_LIMIT': 5,
    }
    
    def __init__(self, domain=None, max_pages=50, output_file='scraped_content.json', *args, **kwargs):
        super(DomainSpider, self).__init__(*args, **kwargs)
        
        if not domain:
            raise ValueError("Domain parameter is required")
        
        self.domain = domain.replace('http://', '').replace('https://', '')
        self.max_pages = int(max_pages)
        self.pages_scraped = 0
        self.output_file = output_file
        
        # Set allowed domains and start URLs
        self.allowed_domains = [self.domain]
        self.start_urls = [f'https://{self.domain}', f'http://{self.domain}']
        
        self.logger.info(f"Starting spider for domain: {self.domain}, max_pages: {self.max_pages}")
    
    def parse(self, response):
        """Main parsing method using universal model"""
        
        # Check if we've reached max pages
        if self.pages_scraped >= self.max_pages:
            self.logger.info(f"Reached max pages limit: {self.max_pages}")
            return
        
        self.pages_scraped += 1
        self.logger.info(f"Scraping page {self.pages_scraped}/{self.max_pages}: {response.url}")
        
        # Extract page metadata first
        yield self.extract_page_metadata(response)
        
        # Extract all content blocks in order
        yield from self.extract_content_blocks(response)
        
        # Follow links if we haven't reached the limit
        if self.pages_scraped < self.max_pages:
            links = response.css('a::attr(href)').getall()
            for link in links[:10]:  # Limit links per page for MVP
                if self.pages_scraped >= self.max_pages:
                    break
                    
                full_url = urljoin(response.url, link)
                if self.is_valid_url(full_url):
                    yield response.follow(link, self.parse)
    
    def extract_page_metadata(self, response):
        """Extract page-level metadata"""
        
        # Extract meta description
        meta_description = response.css('meta[name="description"]::attr(content)').get()
        
        # Extract meta keywords
        meta_keywords = response.css('meta[name="keywords"]::attr(content)').get()
        keywords = [k.strip() for k in meta_keywords.split(',')] if meta_keywords else []
        
        # Extract language
        language = response.css('html::attr(lang)').get() or response.css('meta[http-equiv="Content-Language"]::attr(content)').get()
        
        metadata_item = PageMetadataItem()
        metadata_item['url'] = response.url
        metadata_item['title'] = response.css('title::text').get()
        metadata_item['metadata'] = {
            'description': meta_description,
            'keywords': keywords,
            'language': language,
            'scraped_at': datetime.now().isoformat(),
            'status_code': response.status
        }
        
        return metadata_item
    
    def extract_content_blocks(self, response):
        """Extract content blocks in order using universal model"""
        
        block_counter = 0
        current_heading_id = None
        
        # Get all content elements in document order
        content_selectors = [
            ('heading', 'h1, h2, h3, h4, h5, h6'),
            ('paragraph', 'p'),
            ('list', 'ul, ol'),
            ('link', 'a[href]'),
            ('image', 'img[src]'),
            ('text', 'div:not(:has(h1, h2, h3, h4, h5, h6, p, ul, ol, img))'),
        ]
        
        # Process headings first to establish hierarchy
        for level in range(1, 7):  # h1 to h6
            headings = response.css(f'h{level}')
            for heading in headings:
                block_counter += 1
                
                content_text = heading.css('::text').getall()
                content_text = ' '.join([t.strip() for t in content_text if t.strip()])
                
                if content_text:
                    item = UniversalContentItem()
                    item['block_id'] = block_counter
                    item['content_type'] = 'heading'
                    item['content'] = content_text
                    item['url'] = response.url
                    item['level'] = level
                    item['data'] = {
                        'tag': f'h{level}',
                        'css_classes': heading.css('::attr(class)').get(),
                        'id_attr': heading.css('::attr(id)').get()
                    }
                    
                    # Set as current heading for hierarchy
                    if level == 1:
                        current_heading_id = block_counter
                    
                    yield item
        
        # Process paragraphs
        paragraphs = response.css('p')
        for paragraph in paragraphs:
            block_counter += 1
            
            content_text = paragraph.css('::text').getall()
            content_text = ' '.join([t.strip() for t in content_text if t.strip()])
            
            if content_text and len(content_text) > 10:  # Filter very short content
                item = UniversalContentItem()
                item['block_id'] = block_counter
                item['content_type'] = 'paragraph'
                item['content'] = content_text
                item['url'] = response.url
                item['parent_id'] = current_heading_id
                item['data'] = {
                    'word_count': len(content_text.split()),
                    'css_classes': paragraph.css('::attr(class)').get()
                }
                
                yield item
        
        # Process images
        images = response.css('img[src]')
        for img in images:
            block_counter += 1
            
            src = img.css('::attr(src)').get()
            alt_text = img.css('::attr(alt)').get() or 'Image'
            
            if src:
                # Make URL absolute
                src = urljoin(response.url, src)
                
                item = UniversalContentItem()
                item['block_id'] = block_counter
                item['content_type'] = 'image'
                item['content'] = alt_text
                item['url'] = response.url
                item['parent_id'] = current_heading_id
                item['data'] = {
                    'src': src,
                    'alt': alt_text,
                    'title': img.css('::attr(title)').get(),
                    'width': img.css('::attr(width)').get(),
                    'height': img.css('::attr(height)').get(),
                    'css_classes': img.css('::attr(class)').get()
                }
                
                yield item
        
        # Process links with meaningful text
        links = response.css('a[href]')
        processed_links = set()  # Avoid duplicate links
        
        for link in links:
            href = link.css('::attr(href)').get()
            link_text = link.css('::text').get()
            
            if href and link_text and link_text.strip() and href not in processed_links:
                processed_links.add(href)
                block_counter += 1
                
                # Make URL absolute
                full_href = urljoin(response.url, href)
                
                item = UniversalContentItem()
                item['block_id'] = block_counter
                item['content_type'] = 'link'
                item['content'] = link_text.strip()
                item['url'] = response.url
                item['parent_id'] = current_heading_id
                item['data'] = {
                    'href': full_href,
                    'target': link.css('::attr(target)').get(),
                    'rel': link.css('::attr(rel)').get(),
                    'css_classes': link.css('::attr(class)').get()
                }
                
                yield item
    
    def is_valid_url(self, url):
        """Check if URL is valid for crawling"""
        try:
            parsed = urlparse(url)
            
            # Must be same domain
            if parsed.netloc != self.domain:
                return False
            
            # Skip common non-content URLs
            skip_patterns = [
                r'\.pdf$', r'\.jpg$', r'\.png$', r'\.gif$', r'\.zip$',
                r'\.doc$', r'\.xls$', r'\.ppt$', r'/admin/', r'/login/',
                r'/logout/', r'/api/', r'#', r'javascript:', r'mailto:',
                r'\.css$', r'\.js$', r'\.xml$', r'\.json$'
            ]
            
            for pattern in skip_patterns:
                if re.search(pattern, url, re.IGNORECASE):
                    return False
            
            return True
            
        except Exception as e:
            self.logger.warning(f"Error validating URL {url}: {e}")
            return False 