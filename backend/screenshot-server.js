import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3001;

// allow your front-end origin here:
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

app.get('/api/screenshot', async (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).send('Missing ?url=');
  }

  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const buffer = await page.screenshot({ type: 'png', fullPage: false });
    
    res
      .set('Content-Type', 'image/png')
      .send(buffer);
  } catch (err) {
    console.error('Screenshot error', err);
    res.status(500).send('Failed to capture screenshot');
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`🖼  Screenshot service listening on http://localhost:${PORT}`);
}); 