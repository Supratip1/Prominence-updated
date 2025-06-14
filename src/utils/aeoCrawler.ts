export type AssetType =
  | 'title' | 'meta' | 'canonical' | 'heading' | 'paragraph'
  | 'link' | 'image' | 'video' | 'schema' | 'og' | 'twitter'
  | 'robots' | 'sitemap' | 'screenshot';

export interface Asset {
  id: string;
  type: AssetType;
  title?: string;
  description?: string;
  url: string;
  sourceDomain: string;
  createdAt: Date;
}

// Proxy fallback for resilient HTML fetch
const PROXIES = [
  (url:string)=>`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url:string)=>`https://r.jina.ai/http://${url.replace(/^https?:\/\//,'')}`,
];

// Helper: fallback screenshot URL (always shows something)
function getScreenshotUrl(baseUrl: string) {
  return `https://r.screenshotapi.net/api/v1/screenshot?url=${encodeURIComponent(baseUrl)}&token=demo`;
}

export async function fetchHtmlViaProxy(url:string):Promise<string|null>{
  for (const build of PROXIES){
    try{
      let res = await fetch(build(url), {mode:'cors'});
      // Follow one extra redirect for consent screens
      if ((res.status === 303 || res.status === 302) && res.headers.get('Location')) {
        const loc = res.headers.get('Location');
        if (loc) res = await fetch(loc, {mode:'cors'});
      }
      if (!res.ok || res.status>=400) continue;
      const txt = await res.text();
      if (txt.trim().length<50) continue;          // empty JS shell
      return txt;
    }catch(_){ /* try next */ }
  }
  return null;
}

export async function fetchAEOAssets(domain: string): Promise<Asset[]> {
  const now = new Date();
  const baseUrl = `https://${domain}`;
  const html = await fetchHtmlViaProxy(baseUrl);
  if (!html) throw new Error('UNFETCHABLE');
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const assets: Asset[] = [];

  // Always push a homepage screenshot asset (so grid is never empty)
  assets.push({
    id:'fallback-shot',
    type:'screenshot',
    title:'Site preview',
    url:getScreenshotUrl(baseUrl),
    sourceDomain:domain,
    createdAt:now
  });

  // 1) Core HTML signals
  // Title
  if (doc.title) {
    assets.push({
      id: 'title',
      type: 'title',
      title: 'Title Tag',
      description: doc.title.trim(),
      url: baseUrl,
      sourceDomain: domain,
      createdAt: now
    });
  }
  // Meta tags (description, keywords, robots, viewport, author, canonical, hreflang)
  doc.querySelectorAll('meta[name], meta[http-equiv], meta[property]').forEach((m, i) => {
    const name = m.getAttribute('name') || m.getAttribute('property') || m.getAttribute('http-equiv');
    const content = m.getAttribute('content')?.trim();
    if (name && content) {
      assets.push({
        id: `meta-${name}-${i}`,
        type: 'meta',
        title: `Meta ${name}`,
        description: content,
        url: baseUrl,
        sourceDomain: domain,
        createdAt: now
      });
    }
  });
  // Canonical / hreflang
  doc.querySelectorAll('link[rel="canonical"], link[rel="alternate"]').forEach((l, i) => {
    const href = l.getAttribute('href');
    if (href) {
      assets.push({
        id: `link-rel-${i}`,
        type: 'canonical',
        title: `Link rel="${l.getAttribute('rel')}"`,
        url: new URL(href, baseUrl).href,
        sourceDomain: domain,
        createdAt: now
      });
    }
  });
  // Headings H1–H6
  Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6')).forEach((h, i) => {
    assets.push({
      id: `heading-${i}`,
      type: 'heading',
      title: `${h.tagName}: ${h.textContent?.trim()}`,
      url: baseUrl,
      sourceDomain: domain,
      createdAt: now
    });
  });
  // Paragraph text (first 5 paragraphs)
  Array.from(doc.querySelectorAll('p')).slice(0, 5).forEach((p, i) => {
    assets.push({
      id: `para-${i}`,
      type: 'paragraph',
      description: p.textContent?.trim(),
      url: baseUrl,
      sourceDomain: domain,
      createdAt: now
    });
  });
  // Links (internal vs external)
  Array.from(doc.querySelectorAll<HTMLAnchorElement>('a[href]')).slice(0, 20).forEach((a, i) => {
    const raw = a.getAttribute('href')!;
    // if it's already absolute, keep it; otherwise resolve against baseUrl
    const href = raw.match(/^https?:\/\//)
      ? raw
      : new URL(raw, baseUrl).href;
    // Never show localhost links
    if (href.startsWith(window.location.origin) || href.includes(window.location.hostname)) return;
    assets.push({
      id: `link-${i}`,
      type: 'link',
      title: (a.textContent || href).trim().slice(0, 50),
      url: href,
      sourceDomain: domain,
      createdAt: now
    });
  });

  // 2) Structured data (JSON-LD)
  doc.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]').forEach((s, i) => {
    if (s.textContent) {
      assets.push({
        id: `schema-${i}`,
        type: 'schema',
        title: 'JSON-LD',
        description: s.textContent.trim(),
        url: baseUrl,
        sourceDomain: domain,
        createdAt: now
      });
    }
  });

  // 3) Open Graph & Twitter cards
  doc.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach((m, i) => {
    const metaName = m.getAttribute('property') || m.getAttribute('name')!;
    const content  = m.getAttribute('content')?.trim();
    if (content) {
      assets.push({
        id: `social-${metaName}-${i}`,
        type: metaName.startsWith('og:') ? 'og' : 'twitter',
        title: metaName,
        description: content,
        url: baseUrl,
        sourceDomain: domain,
        createdAt: now
      });
    }
  });
  // OG-video and Twitter player embeds (as real video assets)
  doc.querySelectorAll(`meta[property="og:video"],meta[property="og:video:url"],meta[name="twitter:player"]`).forEach((m,i)=>{
    const content = m.getAttribute('content');
    if (content) {
      assets.push({
        id:`ogvid-${i}`,
        type:'video',
        title:'Embedded video',
        url:new URL(content,baseUrl).href,
        sourceDomain:domain,
        createdAt:now
      });
    }
  });

  // 4) Media: images & videos
  Array.from(doc.querySelectorAll<HTMLImageElement>('img[src]')).slice(0, 10).forEach((img, i) => {
    const src = new URL(img.src, baseUrl).href;
    assets.push({
      id: `img-${i}`,
      type: 'image',
      title: img.alt || `Image ${i+1}`,
      url: src,
      sourceDomain: domain,
      createdAt: now
    });
  });
  Array.from(doc.querySelectorAll('video')).forEach((v, i) => {
    const src = (v as HTMLVideoElement).src;
    if (src) {
      assets.push({
        id: `video-${i}`,
        type: 'video',
        title: `Video ${i+1}`,
        url: src,
        sourceDomain: domain,
        createdAt: now
      });
    }
  });
  // YouTube / Vimeo iframes
  Array.from(doc.querySelectorAll<HTMLIFrameElement>('iframe[src*="youtube"], iframe[src*="vimeo"]')).forEach((f, i) => {
    assets.push({
      id: `embed-${i}`,
      type: 'video',
      title: `Embed Video ${i+1}`,
      url: f.src,
      sourceDomain: domain,
      createdAt: now
    });
  });

  // 5) Technical hints (robots.txt & sitemap.xml)
  try {
    const robotsTxt = await fetch(`https://${domain}/robots.txt`).then(r => r.text());
    assets.push({
      id: 'robots',
      type: 'robots',
      title: 'robots.txt',
      description: robotsTxt,
      url: `https://${domain}/robots.txt`,
      sourceDomain: domain,
      createdAt: now
    });
  } catch {}
  try {
    const sitemapXml = await fetch(`https://${domain}/sitemap.xml`).then(r => r.text());
    assets.push({
      id: 'sitemap',
      type: 'sitemap',
      title: 'sitemap.xml',
      description: sitemapXml,
      url: `https://${domain}/sitemap.xml`,
      sourceDomain: domain,
      createdAt: now
    });
  } catch {}

  // Filter out any assets that point to localhost
  return assets.filter(a => !a.url.includes(window.location.hostname));
} 