"""
Universal Domain Spider
Extracts content using our universal ContentBlock model
"""
import scrapy
from urllib.parse import urljoin, urlparse
from scrapy_project.items import UniversalContentItem, PageMetadataItem
import re
from datetime import datetime
import os

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
        """Extract comprehensive SEO metadata"""
        
        # Basic meta tags
        meta_description = response.css('meta[name="description"]::attr(content)').get()
        meta_keywords = response.css('meta[name="keywords"]::attr(content)').get()
        keywords = [k.strip() for k in meta_keywords.split(',')] if meta_keywords else []
        
        # SEO-critical meta tags
        canonical_url = response.css('link[rel="canonical"]::attr(href)').get()
        robots_meta = response.css('meta[name="robots"]::attr(content)').get()
        viewport = response.css('meta[name="viewport"]::attr(content)').get()
        
        # Open Graph (Facebook) meta tags
        og_title = response.css('meta[property="og:title"]::attr(content)').get()
        og_description = response.css('meta[property="og:description"]::attr(content)').get()
        og_image = response.css('meta[property="og:image"]::attr(content)').get()
        og_url = response.css('meta[property="og:url"]::attr(content)').get()
        og_type = response.css('meta[property="og:type"]::attr(content)').get()
        og_site_name = response.css('meta[property="og:site_name"]::attr(content)').get()
        
        # Twitter Card meta tags
        twitter_card = response.css('meta[name="twitter:card"]::attr(content)').get()
        twitter_title = response.css('meta[name="twitter:title"]::attr(content)').get()
        twitter_description = response.css('meta[name="twitter:description"]::attr(content)').get()
        twitter_image = response.css('meta[name="twitter:image"]::attr(content)').get()
        twitter_site = response.css('meta[name="twitter:site"]::attr(content)').get()
        
        # Language and locale
        language = response.css('html::attr(lang)').get() or response.css('meta[http-equiv="Content-Language"]::attr(content)').get()
        
        # Hreflang tags for international SEO
        hreflang_tags = []
        for hreflang in response.css('link[rel="alternate"][hreflang]'):
            hreflang_tags.append({
                'hreflang': hreflang.css('::attr(hreflang)').get(),
                'href': hreflang.css('::attr(href)').get()
            })
        
        # Schema.org structured data (JSON-LD)
        structured_data = []
        for script in response.css('script[type="application/ld+json"]'):
            try:
                import json
                data = script.css('::text').get()
                if data:
                    structured_data.append(json.loads(data.strip()))
            except:
                pass
        
        # Page title analysis
        title = response.css('title::text').get()
        title_length = len(title) if title else 0
        
        metadata_item = PageMetadataItem()
        metadata_item['url'] = response.url
        metadata_item['title'] = title
        metadata_item['metadata'] = {
            # Basic SEO
            'description': meta_description,
            'description_length': len(meta_description) if meta_description else 0,
            'keywords': keywords,
            'title_length': title_length,
            'canonical_url': canonical_url,
            'robots': robots_meta,
            'viewport': viewport,
            'language': language,
            
            # Social Media SEO
            'open_graph': {
                'title': og_title,
                'description': og_description,
                'image': og_image,
                'url': og_url,
                'type': og_type,
                'site_name': og_site_name
            },
            'twitter_card': {
                'card': twitter_card,
                'title': twitter_title,
                'description': twitter_description,
                'image': twitter_image,
                'site': twitter_site
            },
            
            # International SEO
            'hreflang': hreflang_tags,
            
            # Structured Data
            'structured_data': structured_data,
            'structured_data_count': len(structured_data),
            
            # Technical
            'scraped_at': datetime.now().isoformat(),
            'status_code': response.status,
            'content_type': response.headers.get('Content-Type', '').decode() if response.headers.get('Content-Type') else None,
            'content_length': len(response.text)
        }
        
        return metadata_item
    
    def extract_content_blocks(self, response):
        """Extract content blocks in order using universal model"""
        
        block_counter = 0
        current_heading_id = None
        
        # Get all content elements we extract (for documentation)
        content_selectors = [
            ('heading', 'h1, h2, h3, h4, h5, h6'),     # ✅ Implemented - SEO Critical
            ('paragraph', 'p'),                        # ✅ Implemented - Content
            ('image', 'img[src]'),                     # ✅ Implemented - Alt text SEO
            ('link', 'a[href]'),                       # ✅ Implemented - Internal/External links
            ('list', 'ul, ol'),                        # ✅ Implemented - Structured content
            ('table', 'table'),                        # ✅ Implemented - Data presentation
            ('quote', 'blockquote'),                   # ✅ Implemented - Content SEO
            ('code', 'pre, code'),                     # ✅ Implemented - Tech site SEO
            ('media', 'video, audio, iframe'),         # ✅ Implemented - Modern SEO critical
            # SEO-focused structural elements:
            ('navigation', 'nav'),                     # ✅ Implemented - Site structure
            ('breadcrumb', '[itemtype*="BreadcrumbList"]'), # ✅ Implemented - Navigation SEO
            ('schema_markup', '[itemscope]'),          # ✅ Implemented - Structured data
            # Only generic divs left unimplemented:
            # ('text', 'div'),                         # ❌ Generic divs (too noisy for SEO)
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
        
        # Process images with comprehensive SEO analysis
        images = response.css('img[src]')
        for img in images:
            block_counter += 1
            
            src = img.css('::attr(src)').get()
            alt_text = img.css('::attr(alt)').get()
            
            if src:
                # Make URL absolute
                src = urljoin(response.url, src)
                
                # SEO Analysis
                has_alt = bool(alt_text and alt_text.strip())
                alt_length = len(alt_text) if alt_text else 0
                is_decorative = alt_text == "" if alt_text is not None else False
                
                # Extract filename for SEO analysis
                filename = os.path.basename(src.split('?')[0])  # Remove query params
                has_descriptive_filename = not any(generic in filename.lower() for generic in ['img', 'image', 'photo', 'pic', 'untitled'])
                
                # Check for lazy loading
                is_lazy_loaded = bool(img.css('::attr(loading)').get() == 'lazy' or 
                                    img.css('::attr(data-src)').get() or
                                    'lazy' in (img.css('::attr(class)').get() or '').lower())
                
                item = UniversalContentItem()
                item['block_id'] = block_counter
                item['content_type'] = 'image'
                item['content'] = alt_text or f'Image: {filename}'
                item['url'] = response.url
                item['parent_id'] = current_heading_id
                item['data'] = {
                    'src': src,
                    'alt': alt_text,
                    'filename': filename,
                    'title': img.css('::attr(title)').get(),
                    'width': img.css('::attr(width)').get(),
                    'height': img.css('::attr(height)').get(),
                    'css_classes': img.css('::attr(class)').get(),
                    'loading': img.css('::attr(loading)').get(),
                    'srcset': img.css('::attr(srcset)').get(),
                    # SEO Analysis
                    'seo_analysis': {
                        'has_alt_text': has_alt,
                        'alt_text_length': alt_length,
                        'is_decorative': is_decorative,
                        'has_descriptive_filename': has_descriptive_filename,
                        'is_lazy_loaded': is_lazy_loaded,
                        'alt_quality': 'good' if has_alt and 10 <= alt_length <= 125 else 'needs_improvement'
                    }
                }
                
                yield item
        
        # Process links with comprehensive SEO analysis
        links = response.css('a[href]')
        processed_links = set()  # Avoid duplicate links
        
        for link in links:
            href = link.css('::attr(href)').get()
            link_text = link.css('::text').get()
            
            if href and href not in processed_links:
                processed_links.add(href)
                block_counter += 1
                
                # Make URL absolute
                full_href = urljoin(response.url, href)
                
                # SEO Analysis
                is_internal = self.domain in full_href
                is_external = not is_internal and not href.startswith('#') and not href.startswith('mailto:') and not href.startswith('tel:')
                is_anchor = href.startswith('#')
                is_email = href.startswith('mailto:')
                is_phone = href.startswith('tel:')
                
                # Analyze anchor text
                anchor_text = (link_text or '').strip()
                has_anchor_text = bool(anchor_text)
                anchor_length = len(anchor_text)
                is_generic_anchor = anchor_text.lower() in ['click here', 'read more', 'more', 'here', 'link']
                
                # Check for SEO attributes
                rel_attr = link.css('::attr(rel)').get() or ''
                is_nofollow = 'nofollow' in rel_attr
                is_sponsored = 'sponsored' in rel_attr
                is_ugc = 'ugc' in rel_attr
                opens_new_tab = link.css('::attr(target)').get() == '_blank'
                
                # Title attribute for accessibility
                has_title = bool(link.css('::attr(title)').get())
                
                item = UniversalContentItem()
                item['block_id'] = block_counter
                item['content_type'] = 'link'
                item['content'] = anchor_text or f'Link to {full_href}'
                item['url'] = response.url
                item['parent_id'] = current_heading_id
                item['data'] = {
                    'href': full_href,
                    'original_href': href,
                    'anchor_text': anchor_text,
                    'target': link.css('::attr(target)').get(),
                    'rel': rel_attr,
                    'title': link.css('::attr(title)').get(),
                    'css_classes': link.css('::attr(class)').get(),
                    # SEO Analysis
                    'seo_analysis': {
                        'link_type': 'internal' if is_internal else 'external' if is_external else 'anchor' if is_anchor else 'email' if is_email else 'phone' if is_phone else 'other',
                        'is_internal': is_internal,
                        'is_external': is_external,
                        'is_nofollow': is_nofollow,
                        'is_sponsored': is_sponsored,
                        'is_ugc': is_ugc,
                        'opens_new_tab': opens_new_tab,
                        'has_anchor_text': has_anchor_text,
                        'anchor_text_length': anchor_length,
                        'is_generic_anchor': is_generic_anchor,
                        'has_title_attribute': has_title,
                        'anchor_quality': 'good' if has_anchor_text and not is_generic_anchor and 3 <= anchor_length <= 60 else 'needs_improvement'
                    }
                }
                
                yield item
        
        # Process lists (ul, ol)
        lists = response.css('ul, ol')
        for list_elem in lists:
            block_counter += 1
            
            # Extract list items
            list_items = list_elem.css('li::text').getall()
            list_items = [item.strip() for item in list_items if item.strip()]
            
            if list_items:
                list_type = 'ordered_list' if list_elem.root.tag == 'ol' else 'unordered_list'
                content_text = '\n'.join([f"• {item}" for item in list_items])
                
                item = UniversalContentItem()
                item['block_id'] = block_counter
                item['content_type'] = 'list'
                item['content'] = content_text
                item['url'] = response.url
                item['parent_id'] = current_heading_id
                item['data'] = {
                    'list_type': list_type,
                    'items': list_items,
                    'item_count': len(list_items),
                    'css_classes': list_elem.css('::attr(class)').get()
                }
                
                yield item
        
        # Process tables
        tables = response.css('table')
        for table in tables:
            block_counter += 1
            
            # Extract table headers
            headers = table.css('th::text').getall()
            headers = [h.strip() for h in headers if h.strip()]
            
            # Extract table rows
            rows = []
            for row in table.css('tr'):
                cells = row.css('td::text').getall()
                cells = [c.strip() for c in cells if c.strip()]
                if cells:
                    rows.append(cells)
            
            if headers or rows:
                # Create readable table content
                content_parts = []
                if headers:
                    content_parts.append("Headers: " + " | ".join(headers))
                if rows:
                    for i, row in enumerate(rows[:3]):  # Show first 3 rows
                        content_parts.append(f"Row {i+1}: " + " | ".join(row))
                    if len(rows) > 3:
                        content_parts.append(f"... and {len(rows)-3} more rows")
                
                content_text = '\n'.join(content_parts)
                
                item = UniversalContentItem()
                item['block_id'] = block_counter
                item['content_type'] = 'table'
                item['content'] = content_text
                item['url'] = response.url
                item['parent_id'] = current_heading_id
                item['data'] = {
                    'headers': headers,
                    'rows': rows,
                    'row_count': len(rows),
                    'column_count': len(headers) if headers else (len(rows[0]) if rows else 0),
                    'css_classes': table.css('::attr(class)').get()
                }
                
                yield item
        
        # Process navigation elements for SEO structure analysis
        nav_elements = response.css('nav')
        for nav in nav_elements:
            block_counter += 1
            
            # Extract navigation links
            nav_links = nav.css('a')
            nav_items = []
            for nav_link in nav_links:
                nav_items.append({
                    'text': nav_link.css('::text').get(),
                    'href': nav_link.css('::attr(href)').get()
                })
            
            if nav_items:
                item = UniversalContentItem()
                item['block_id'] = block_counter
                item['content_type'] = 'navigation'
                item['content'] = f"Navigation with {len(nav_items)} items"
                item['url'] = response.url
                item['data'] = {
                    'nav_items': nav_items,
                    'nav_count': len(nav_items),
                    'css_classes': nav.css('::attr(class)').get(),
                    'role': nav.css('::attr(role)').get(),
                    'aria_label': nav.css('::attr(aria-label)').get()
                }
                
                yield item
        
        # Process breadcrumb navigation (SEO critical)
        breadcrumb_selectors = [
            '[itemtype*="BreadcrumbList"]',  # Schema.org breadcrumbs
            '.breadcrumb, .breadcrumbs',     # Common CSS classes
            '[role="navigation"] ol, [role="navigation"] ul'  # ARIA breadcrumbs
        ]
        
        for selector in breadcrumb_selectors:
            breadcrumbs = response.css(selector)
            for breadcrumb in breadcrumbs:
                block_counter += 1
                
                # Extract breadcrumb items
                breadcrumb_items = []
                
                # Try schema.org format first
                schema_items = breadcrumb.css('[itemtype*="ListItem"]')
                if schema_items:
                    for item_elem in schema_items:
                        name = item_elem.css('[itemprop="name"]::text').get()
                        url = item_elem.css('[itemprop="item"]::attr(href)').get()
                        position = item_elem.css('[itemprop="position"]::attr(content)').get()
                        if name:
                            breadcrumb_items.append({
                                'name': name,
                                'url': url,
                                'position': position
                            })
                else:
                    # Fallback to regular links
                    links = breadcrumb.css('a')
                    for i, link in enumerate(links):
                        breadcrumb_items.append({
                            'name': link.css('::text').get(),
                            'url': link.css('::attr(href)').get(),
                            'position': str(i + 1)
                        })
                
                if breadcrumb_items:
                    item = UniversalContentItem()
                    item['block_id'] = block_counter
                    item['content_type'] = 'breadcrumb'
                    item['content'] = ' > '.join([item['name'] for item in breadcrumb_items if item['name']])
                    item['url'] = response.url
                    item['data'] = {
                        'breadcrumb_items': breadcrumb_items,
                        'breadcrumb_count': len(breadcrumb_items),
                        'has_schema_markup': bool(schema_items),
                        'css_classes': breadcrumb.css('::attr(class)').get()
                    }
                    
                    yield item
                    break  # Only process first breadcrumb found
        
        # Process elements with microdata (schema.org)
        schema_elements = response.css('[itemscope]')
        for schema_elem in schema_elements:
            block_counter += 1
            
            itemtype = schema_elem.css('::attr(itemtype)').get()
            if itemtype:
                # Extract properties
                properties = {}
                for prop in schema_elem.css('[itemprop]'):
                    prop_name = prop.css('::attr(itemprop)').get()
                    prop_value = prop.css('::text').get() or prop.css('::attr(content)').get() or prop.css('::attr(href)').get()
                    if prop_name and prop_value:
                        properties[prop_name] = prop_value
                
                if properties:
                    item = UniversalContentItem()
                    item['block_id'] = block_counter
                    item['content_type'] = 'schema_markup'
                    item['content'] = f"Schema.org {itemtype.split('/')[-1]} markup"
                    item['url'] = response.url
                    item['data'] = {
                        'itemtype': itemtype,
                        'properties': properties,
                        'property_count': len(properties)
                    }
                    
                    yield item
        
        # Process blockquotes (SEO-relevant for content sites)
        blockquotes = response.css('blockquote')
        for quote in blockquotes:
            block_counter += 1
            
            quote_text = quote.css('::text').getall()
            quote_text = ' '.join([t.strip() for t in quote_text if t.strip()])
            
            # Extract citation if present
            cite_elem = quote.css('cite')
            citation = cite_elem.css('::text').get() if cite_elem else None
            cite_url = quote.css('::attr(cite)').get()  # cite attribute
            
            if quote_text:
                item = UniversalContentItem()
                item['block_id'] = block_counter
                item['content_type'] = 'quote'
                item['content'] = quote_text
                item['url'] = response.url
                item['parent_id'] = current_heading_id
                item['data'] = {
                    'citation': citation,
                    'cite_url': cite_url,
                    'word_count': len(quote_text.split()),
                    'css_classes': quote.css('::attr(class)').get(),
                    # SEO Analysis
                    'seo_analysis': {
                        'has_citation': bool(citation or cite_url),
                        'quote_length': len(quote_text),
                        'quote_quality': 'good' if 20 <= len(quote_text) <= 300 else 'needs_review'
                    }
                }
                
                yield item
        
        # Process code blocks (SEO-relevant for tech sites)
        code_elements = response.css('pre, code')
        for code_elem in code_elements:
            block_counter += 1
            
            code_text = code_elem.css('::text').get()
            if code_text and code_text.strip():
                # Detect programming language
                language = None
                class_attr = code_elem.css('::attr(class)').get() or ''
                
                # Common language detection patterns
                lang_patterns = {
                    'python': ['python', 'py'],
                    'javascript': ['javascript', 'js', 'node'],
                    'html': ['html', 'markup'],
                    'css': ['css', 'stylesheet'],
                    'sql': ['sql', 'mysql', 'postgres'],
                    'bash': ['bash', 'shell', 'sh'],
                    'json': ['json'],
                    'xml': ['xml']
                }
                
                for lang, patterns in lang_patterns.items():
                    if any(pattern in class_attr.lower() for pattern in patterns):
                        language = lang
                        break
                
                item = UniversalContentItem()
                item['block_id'] = block_counter
                item['content_type'] = 'code'
                item['content'] = code_text.strip()[:200] + '...' if len(code_text) > 200 else code_text.strip()
                item['url'] = response.url
                item['parent_id'] = current_heading_id
                item['data'] = {
                    'language': language,
                    'tag': code_elem.root.tag,
                    'full_code': code_text.strip(),
                    'code_length': len(code_text.strip()),
                    'css_classes': class_attr,
                    # SEO Analysis
                    'seo_analysis': {
                        'has_language_specified': bool(language),
                        'is_inline': code_elem.root.tag == 'code',
                        'is_block': code_elem.root.tag == 'pre',
                        'code_quality': 'good' if language and len(code_text.strip()) > 10 else 'needs_review'
                    }
                }
                
                yield item
        
        # Process media elements (CRITICAL for modern SEO)
        media_elements = response.css('video, audio, iframe')
        for media in media_elements:
            block_counter += 1
            
            tag_name = media.root.tag
            src = media.css('::attr(src)').get()
            
            # For video and audio
            if tag_name in ['video', 'audio']:
                # Check for multiple sources
                sources = media.css('source')
                source_list = []
                for source in sources:
                    source_list.append({
                        'src': source.css('::attr(src)').get(),
                        'type': source.css('::attr(type)').get()
                    })
                
                # Extract text content (captions, descriptions)
                text_content = media.css('::text').get() or ''
                
                # Video/Audio specific attributes
                poster = media.css('::attr(poster)').get() if tag_name == 'video' else None
                controls = media.css('::attr(controls)').get() is not None
                autoplay = media.css('::attr(autoplay)').get() is not None
                
                item = UniversalContentItem()
                item['block_id'] = block_counter
                item['content_type'] = 'media'
                item['content'] = text_content or f'{tag_name.title()} content'
                item['url'] = response.url
                item['parent_id'] = current_heading_id
                item['data'] = {
                    'media_type': tag_name,
                    'src': src,
                    'sources': source_list,
                    'poster': poster,
                    'controls': controls,
                    'autoplay': autoplay,
                    'width': media.css('::attr(width)').get(),
                    'height': media.css('::attr(height)').get(),
                    'css_classes': media.css('::attr(class)').get(),
                    # SEO Analysis
                    'seo_analysis': {
                        'has_multiple_sources': len(source_list) > 0,
                        'has_poster': bool(poster) if tag_name == 'video' else None,
                        'has_controls': controls,
                        'has_autoplay': autoplay,
                        'has_text_content': bool(text_content.strip()),
                        'media_quality': 'good' if (poster or text_content) and not autoplay else 'needs_review'
                    }
                }
                
                yield item
            
            # For iframes (embedded content)
            elif tag_name == 'iframe':
                title = media.css('::attr(title)').get()
                width = media.css('::attr(width)').get()
                height = media.css('::attr(height)').get()
                
                # Detect iframe type
                iframe_type = 'unknown'
                if src:
                    if 'youtube.com' in src or 'youtu.be' in src:
                        iframe_type = 'youtube'
                    elif 'vimeo.com' in src:
                        iframe_type = 'vimeo'
                    elif 'maps.google.com' in src or 'google.com/maps' in src:
                        iframe_type = 'google_maps'
                    elif 'twitter.com' in src:
                        iframe_type = 'twitter'
                    elif 'facebook.com' in src:
                        iframe_type = 'facebook'
                
                item = UniversalContentItem()
                item['block_id'] = block_counter
                item['content_type'] = 'embedded_content'
                item['content'] = title or f'Embedded {iframe_type} content'
                item['url'] = response.url
                item['parent_id'] = current_heading_id
                item['data'] = {
                    'iframe_src': src,
                    'iframe_type': iframe_type,
                    'title': title,
                    'width': width,
                    'height': height,
                    'css_classes': media.css('::attr(class)').get(),
                    'loading': media.css('::attr(loading)').get(),
                    # SEO Analysis
                    'seo_analysis': {
                        'has_title': bool(title),
                        'has_dimensions': bool(width and height),
                        'is_lazy_loaded': media.css('::attr(loading)').get() == 'lazy',
                        'embed_quality': 'good' if title and width and height else 'needs_review'
                    }
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