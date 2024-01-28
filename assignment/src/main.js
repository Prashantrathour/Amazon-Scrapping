const AmazonScraper = require('./scraper/scraper');
const DataProcessor = require('./data-processor/data-processor');

async function main() {
  try {
    const pincode = '242307';
    const scraper = new AmazonScraper(pincode);
  const scrapedData = await scraper.scrapeAllProducts();

  const processor = new DataProcessor(scrapedData);
  console.log(scrapedData)
  processor.save("output.json.gz");
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
