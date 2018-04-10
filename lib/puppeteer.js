/**
 * This gets the height of the component
 * and returns that to the main process
 */

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();


  /**
   * Get page height
   */

  async function getHeight(url) {
    await page.goto(url);
    
    const height = await page.evaluate(() => {
      return document.body.getBoundingClientRect().height
    });

    return height;
  }


  /**
   * Notify process app is ready
   */

  process.send('puppeteer-ready');

  
  /**
   * Receive message
   */

  process.on('message', (data) => {    
    if (data) {
      if (data.exit) {
        browser.close();
        process.exitCode = 1;
        return;
      } else if (data.url) {
        getHeight(data.url).then((height) => {
          process.send({
            height: height
          });
        });
      }
    }
  });
})();