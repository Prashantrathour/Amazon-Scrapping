const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

class AmazonScraper {
  constructor(pincode) {
    this.pincode = pincode;
  }

  async scrapeAmazon() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      // Navigate to Amazon with the specified pincode

      await page.goto(
        `https://www.amazon.in/s?k=laptops&pincode=${this.pincode}`
      );
    } catch (error) {
      console.error("Error navigating to Amazon:", error);
    }

    // Get the HTML content after loading
    const htmlContent = await page.content();

    await browser.close();

    return htmlContent;
  }

  async scrapeProductInfo(productUrl) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      // Navigate to the product page
      await page.goto("https://www.amazon.in" + productUrl, {
        waitUntil: "domcontentloaded",
        timeout: 0,
      });

      // Extract data using Cheerio
      const htmlContent = await page.content();
      const description = this.extractDescription(htmlContent);
      const $ = cheerio.load(htmlContent);
  // console.log(htmlContent)
      const extractedData = {};
      $("tbody")
        .find("tr")
        .each((index, element) => {
          const key = $(element).find("th").text().trim();
          const value = $(element).find("td").text().trim();
          extractedData[key] = value;
        });

      function extractProperties(data) {
        const extractedprop = {};

        const propertiesToExtract = [
          "Series",
          "Manufacturer",
          "Brand",
          "Camera",
          "Ports",
          "Battery",
          "Graphics",
          "Memory",
          "Screen",
          "Processor",
          "ASIN",
          "Item Weight",
          "Wifi/Bluetooth",
          "Ports",
          "Battery",
          "Average Battery Life (in hours)",
          "Number of USB 2.0 Ports",
          "Connectivity Type",
          "Graphics Card Interface",
          "Graphics RAM Type",
          "Graphics Card Description",
          "Graphics Chipset Brand",
          "Audio Details",
          "Hard Drive Size",
          "Maximum Memory Supported",
          "Memory Technology",
          "RAM Size",
          "Processor Count",
          "Processor Speed",
          "Processor Type",
          "Item model number",
          "Package Dimensions",
        ];

        for (const property of propertiesToExtract) {
          if (data[property]) {
            extractedprop[property] = data[property];
          }
        }

        return extractedprop;
      }
      const properties = extractProperties(extractedData);

      const productInfo = {
        SKUId: properties["ASIN"],
        productName: $(".a-size-large.product-title-word-break").text().trim(),
        productTitle: $(".a-size-large.product-title-word-break").text().trim(),
        description: description.join("\n"),
        category: properties["Series"],
        MRP: $('span.a-size-small.a-color-secondary.aok-align-center.basisPrice').text().trim(),
        sellingPrice: $('span.aok-align-center.reinventPricePriceToPayMargin.priceToPay span.a-price-whole').text().trim(),
        discount: $(".aok-offscreen").text().trim(),
        weight: properties["Item Weight"],
        brandName: properties["Brand"],
        imageUrl: $("#landingImage").attr("src"),
        laptopSpacification: properties,
      };

      await browser.close();

      return productInfo;
    } catch (error) {
      console.error("Error scraping product info:", error);
      await browser.close();
      return null;
    }
  }

  async scrapeAllProducts() {
    try {
      const htmlContent = await this.scrapeAmazon();
      // Extract product URLs from the Amazon page
      const productUrls = this.extractProductUrls(htmlContent);

      // Use Promise.all to scrape product information asynchronously
      const productInfo = await Promise.all(
        productUrls.map((url) => this.scrapeProductInfo(url))
      );

      return productInfo.filter((info) => info !== null); // Filter out null values
    } catch (error) {
      console.error("Error scraping all products:", error);
      return error;
    }
  }

  extractProductUrls(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const productUrls = $('[class="a-link-normal s-no-outline"]')
      .map((index, element) => $(element).attr("href"))
      .get();

    return productUrls;
  }
  extractDescription(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const extractedData = [];

    $("div#feature-bullets").each((index, element) => {
    
      const listItemText = $(element).text().trim();
      extractedData.push(listItemText);
    });

    return extractedData;
  }
}

module.exports = AmazonScraper;
