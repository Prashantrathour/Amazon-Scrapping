const puppeteer = require('puppeteer');
const AmazonScraper = require('./scraper/scraper');
const DataProcessor = require('./data-processor/data-processor');
const PageUrlScraper = require('./scraper/pageUrlScraper');

async function getHtmlContent(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url);
    } catch (error) {
        console.error("Error navigating to URL:", error);
    }

    const htmlContent = await page.content();
    await browser.close();

    return htmlContent;
}

async function main() {
    try {
        const pincode = '560001';
        // const pincode = '110001';
        const baseUrl = 'https://www.amazon.in';
        




        //this code for geting data from everypage  (Heavy task)
        // let mainHtmlContent = await getHtmlContent(`${baseUrl}/s?k=laptops&pincode=${pincode}`);
        // let pageUrlScraper = new PageUrlScraper(baseUrl);
        // let pageUrls = await pageUrlScraper.scrapePages(mainHtmlContent);

        // let scrapedData = [];

        // // Using Promise.all to scrape data from multiple pages concurrently
        // await Promise.all(pageUrls.map(async (pageUrl,i) => {
        //     console.log("scrapping done-"+i+1)
        //     scrapedData.push(data);
        // }));
        



// scrape current page
        const scraper = new AmazonScraper(`${baseUrl}/s?k=laptops&pincode=${pincode}`);
        let scrapedData = await scraper.scrapeAllProducts();
        
        const processor = new DataProcessor(scrapedData);
        processor.save("output.json.gz");
        console.log("Data saved succesfully")
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
