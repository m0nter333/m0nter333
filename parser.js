const puppeteer = require('puppeteer');

async function fetchMMCGlobalData() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--ignore-certificate-errors'] });
  try {
    const page = await browser.newPage();
    await page.goto('https://tbg.airframes.io/mmcglobal/dashboard/mmcGlobal', { waitUntil: 'networkidle2', timeout: 30000 });
    const text = await page.evaluate(() => document.body.innerText);
    const blocks = text.split('time: ').slice(1);
    const results = blocks.map(b => {
      const lines = ('time: ' + b).split('\n').map(l => l.trim()).filter(Boolean);
      const obj = {};
      for (const line of lines) {
        const idx = line.indexOf(':');
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim().replace(/\s+/g, '_');
        const value = line.slice(idx + 1).trim();
        obj[key] = value;
      }
      return obj;
    });
    return results;
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  fetchMMCGlobalData().then(data => {
    console.log(JSON.stringify(data.slice(0, 3), null, 2));
  }).catch(err => {
    console.error('Error', err);
    process.exit(1);
  });
}

module.exports = fetchMMCGlobalData;
