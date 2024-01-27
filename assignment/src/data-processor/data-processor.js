const fs = require('fs');
const zlib = require('zlib');

class DataProcessor {
  constructor(data) {
    this.data = data;
  }

  process() {
    const processedData = this.data.map(product => {
      //  Extracting relevant information
      const processedProduct = {
        productName: product.productName,
        // discountedPrice: this.calculateDiscountedPrice(product.productPrice, product.discount),
        // Add more processed fields as needed
      };

      return processedProduct;
    });

    return processedData;
  }

  // calculateDiscountedPrice(originalPrice, discount) {
  //   // Example: Calculate discounted price based on the discount percentage
  //   const discountPercentage = parseFloat(discount.replace('%', ''));
  //   const discountedPrice = originalPrice * (1 - discountPercentage / 100);

  //   return discountedPrice.toFixed(2); // Round to two decimal places
  // }

  save(outputFile) {
    // Save the processed data
    const processedData = this.process();
    const jsonData = JSON.stringify(this.data);
    const gzippedData = zlib.gzipSync(jsonData);

    fs.writeFileSync(outputFile, gzippedData);
  }
}

module.exports = DataProcessor;
