import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;
  
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const data = await page.evaluate(() => {
      const title = document.querySelector('.complaint-title')?.textContent?.trim() || '';
      const complaintText = document.querySelector('.complaint-body')?.textContent?.trim() || '';
      const date = document.querySelector('.complaint-date')?.textContent?.trim() || '';
      
      return { title, complaintText, date };
    });

    await browser.close();
    res.json(data);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape the complaint' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});