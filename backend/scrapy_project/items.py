"""
Scrapy Items for Domain Content Scraper
Simple items that map to our universal ContentBlock model
"""
import scrapy
from itemloaders.processors import TakeFirst, MapCompose
from w3lib.html import remove_tags, replace_escape_chars

class UniversalContentItem(scrapy.Item):
    """Universal item that maps directly to our ContentBlock model"""
    
    # Core fields (matching ContentBlock)
    block_id = scrapy.Field(output_processor=TakeFirst())
    content_type = scrapy.Field(output_processor=TakeFirst())  # "heading", "paragraph", "image", etc.
    content = scrapy.Field(
        input_processor=MapCompose(remove_tags, replace_escape_chars, str.strip),
        output_processor=TakeFirst()
    )
    
    # Hierarchy fields
    parent_id = scrapy.Field(output_processor=TakeFirst())
    level = scrapy.Field(output_processor=TakeFirst())
    
    # Flexible data storage (the magic field!)
    data = scrapy.Field()  # Dict that can store any additional data
    
    # Page metadata
    url = scrapy.Field(output_processor=TakeFirst())
    page_title = scrapy.Field(
        input_processor=MapCompose(remove_tags, replace_escape_chars, str.strip),
        output_processor=TakeFirst()
    )

class PageMetadataItem(scrapy.Item):
    """Item for page-level metadata"""
    url = scrapy.Field(output_processor=TakeFirst())
    title = scrapy.Field(
        input_processor=MapCompose(remove_tags, replace_escape_chars, str.strip),
        output_processor=TakeFirst()
    )
    metadata = scrapy.Field()  # Dict for flexible metadata storage 