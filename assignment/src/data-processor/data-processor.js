const fs = require('fs');
const zlib = require('zlib');

class DataProcessor {
  constructor(data) {
    this.data = data;
  }
  discount(sellingPrice,MRP){
    // Convert the prices to numbers and remove any non-numeric characters
    const selling = Number(sellingPrice.replace(/[^\d.]/g, ''));
    const mrp = Number(MRP.replace(/[^\d.]/g, ''));
 
    // Calculate the discount percentage
    const discountPercentage = ((mrp - selling) / mrp) * 100;
 
    // Round the discount percentage to two decimal places
    return discountPercentage.toFixed(2);
  }
  process() {
    const processedData = this.data.map(product => {
      const processedProduct = {
        SKUId: product.SKUId,
        productName: product.productName,
        productTitle: product.productTitle,
        description: product.description,
        category: product.category,
        MRP: product?.MRP?.split('₹')[1].replace(/,/g, ''),
        sellingPrice: product.sellingPrice.replace(/,/g, ''),
        discount: this.discount(product.sellingPrice.replace(/,/g, ''),product?.MRP?.split('₹')[1].replace(/,/g, '')),
        weight: product.weight,
        brandName: product.brandName,
        imageUrl: product.imageUrl,
        laptopSpacification: product.laptopSpacification,
      };

      return processedProduct;
    });

    return processedData;
  }

  save(outputFile) {
    const processedData = this.process();
    const jsonData = JSON.stringify(processedData);
    const gzippedData = zlib.gzipSync(jsonData);

    fs.writeFileSync(outputFile, gzippedData);
  }
}

module.exports = DataProcessor;
