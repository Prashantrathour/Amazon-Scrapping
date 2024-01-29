const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

class PageUrlScraper {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async scrapePages(htmlContent) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        try {
            const pagesURL = [];
            let currentPage = 1;
            let nextPageExists = true;
            let $ = cheerio.load(htmlContent);

            while (nextPageExists) {
                console.log(`Scraping page ${currentPage}...`);

                let nextButton = $('[class="s-pagination-item s-pagination-next s-pagination-button s-pagination-separator"]');
                if (nextButton.length > 0) {
                    const nextPageUrl = nextButton.attr('href');
                    pagesURL.push(this.baseUrl + nextPageUrl.replace(/page=\d+/, `page=${currentPage}`));
                    await page.goto(this.baseUrl + nextPageUrl);
                    let htmlContent = await page.content();
                    $ = cheerio.load(htmlContent);
                    currentPage++;
                } else {
                    nextPageExists = false;
                }
            }
            return pagesURL;
        } catch (error) {
            console.error('Error scraping pages:', error);
        } finally {
            await browser.close();
        }
    }
}


module.exports=PageUrlScraper
