"""
Scrapy Pipelines for Domain Content Scraper
Simple pipelines that work with our universal model
"""
import json
import logging
from datetime import datetime
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class ContentBlockPipeline:
    """Pipeline to process and organize content blocks"""
    
    def __init__(self):
        self.blocks_by_page = {}  # {url: [content_blocks]}
        self.page_metadata = {}   # {url: metadata}
        self.block_counter = 0
    
    def process_item(self, item, spider):
        """Process items and organize into pages"""
        
        if item.__class__.__name__ == 'PageMetadataItem':
            # Store page metadata
            self.page_metadata[item['url']] = {
                'title': item.get('title'),
                'metadata': item.get('metadata', {})
            }
            return item
        
        elif item.__class__.__name__ == 'UniversalContentItem':
            # Process content block
            self.block_counter += 1
            
            url = item['url']
            
            # Initialize page if not exists
            if url not in self.blocks_by_page:
                self.blocks_by_page[url] = []
            
            # Create content block in our universal format
            content_block = {
                'id': self.block_counter,
                'type': item['content_type'],
                'content': item['content'],
                'data': item.get('data', {}),
                'parent_id': item.get('parent_id'),
                'level': item.get('level')
            }
            
            # Remove None values
            content_block = {k: v for k, v in content_block.items() if v is not None}
            
            self.blocks_by_page[url].append(content_block)
            
            logger.info(f"Processed {item['content_type']} block from {url}")
            return item
        
        return item
    
    def close_spider(self, spider):
        """Output final results when spider closes"""
        logger.info(f"Spider finished. Processed {len(self.blocks_by_page)} pages with {self.block_counter} content blocks")

class JsonOutputPipeline:
    """Pipeline to output results in our universal format"""
    
    def __init__(self):
        self.pages_data = []
    
    def open_spider(self, spider):
        """Initialize when spider starts"""
        self.pages_data = []
    
    def process_item(self, item, spider):
        """Collect items for final output"""
        return item  # Just pass through, we'll use the ContentBlockPipeline data
    
    def close_spider(self, spider):
        """Output final JSON in our universal PageContent format"""
        
        # Get data from ContentBlockPipeline
        content_pipeline = None
        for pipeline in spider.crawler.engine.scraper.itemproc.middlewares:
            if isinstance(pipeline, ContentBlockPipeline):
                content_pipeline = pipeline
                break
        
        if not content_pipeline:
            logger.warning("ContentBlockPipeline not found")
            return
        
        # Convert to our universal PageContent format
        pages = []
        for url, blocks in content_pipeline.blocks_by_page.items():
            page_meta = content_pipeline.page_metadata.get(url, {})
            
            page_data = {
                'url': url,
                'title': page_meta.get('title'),
                'blocks': blocks,
                'metadata': page_meta.get('metadata', {
                    'total_blocks': len(blocks),
                    'scraped_at': datetime.now().isoformat()
                })
            }
            pages.append(page_data)
        
        # Output to file for testing
        output_file = getattr(spider, 'output_file', 'scraped_content.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                'pages': pages,
                'summary': {
                    'total_pages': len(pages),
                    'total_blocks': content_pipeline.block_counter,
                    'scraped_at': datetime.now().isoformat()
                }
            }, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Output written to {output_file}")

class ValidationPipeline:
    """Simple validation pipeline"""
    
    def process_item(self, item, spider):
        """Validate items"""
        
        if item.__class__.__name__ == 'UniversalContentItem':
            # Ensure required fields
            if not item.get('content_type'):
                raise ValueError("content_type is required")
            if not item.get('content'):
                raise ValueError("content is required")
            if not item.get('url'):
                raise ValueError("url is required")
        
        return item 