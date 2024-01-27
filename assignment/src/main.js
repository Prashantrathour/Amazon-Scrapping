const AmazonScraper = require('./scraper/scraper');
const DataProcessor = require('./data-processor/data-processor');

async function main() {
  try {
    const pincode = '242307'; // Replace with the desired pincode
    const scraper = new AmazonScraper(pincode);
    
    // Scrape all products from Amazon
    const scrapedData = await scraper.scrapeAllProducts();
    console.log("data",scrapedData)

    // Instantiate the data processor
    const dataProcessor = new DataProcessor(scrapedData);

    // Process and save the data
    dataProcessor.save('output.ndjson.gz');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
