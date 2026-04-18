import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  console.log("Navigating to Lusion Labs...");
  await page.goto('https://labs.lusion.co/', { waitUntil: 'domcontentloaded', timeout: 0 });

  // wait an extra 5 seconds for webgl to start injecting elements
  await new Promise(r => setTimeout(r, 5000));
  

  console.log("Injecting scroll tracker...");
  const data = await page.evaluate(async () => {
    return new Promise((resolve) => {
      // Find a project item or article
      let targets = document.querySelectorAll('article, .item, [class*="project"], [class*="card"]');
      let target = Array.from(targets).find(el => {
        let rect = el.getBoundingClientRect();
        return rect.top > window.innerHeight; // find one below the fold
      });
      
      if (!target) target = targets[0] || document.body;

      const states = [];
      let steps = 0;
      
      const interval = setInterval(() => {
        window.scrollBy(0, 50);
        let s = window.getComputedStyle(target);
        states.push({
          scroll: window.scrollY,
          transform: s.transform,
          transition: s.transition,
          opacity: s.opacity,
          transformOrigin: s.transformOrigin,
          perspective: s.perspective
        });

        steps++;
        if (steps > 60) {
          clearInterval(interval);
          resolve(states);
        }
      }, 50);
    });
  });

  fs.writeFileSync('lusion_extracted_physics.json', JSON.stringify(data, null, 2));
  console.log("Extraction complete. Saved to lusion_extracted_physics.json");
  await browser.close();
})();
