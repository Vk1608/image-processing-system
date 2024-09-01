const fs = require('fs');
const csvParser = require('csv-parser');
const Request = require('../models/Request');
const imageProcessingQueue = require('../utils/Worker');

const uploadCSVHelper = async ({ file, requestId }, res) => {
    const csvFilePath = file.path;
    const results = [];
    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (data) => results.push({
            serialNumber: data['S. No.'],
            productName: data['Product Name'],
            inputImageUrls: data['Input Image Urls'].split(', ')
        }))
        .on('end', async () => {
            const newRequest = new Request({ requestId, productData: results, status: 'Pending' });
            await newRequest.save();
            imageProcessingQueue.add({ requestId });
            fs.unlinkSync(csvFilePath);
        });
}

async function exportToCSV() {
    try {
        const products = await Product.find();

        const csvWriter = createObjectCsvWriter({
            header: [
                { id: 'serialNumber', title: 'Serial Number' },
                { id: 'productName', title: 'Product Name' },
                { id: 'inputUrls', title: 'Input Image URLs' },
                { id: 'outputUrls', title: 'Output Image URLs' },
            ],
        });
        const records = products.map(product => {
            const inputUrls = product.images.map(img => img.inputUrl).join(', ');
            const outputUrls = product.images.map(img => img.outputUrl).join(', ');

            return {
                serialNumber: product.serialNumber,
                productName: product.productName,
                inputUrls: inputUrls,
                outputUrls: outputUrls,
            };
        });
        await csvWriter.writeRecords(records);
        console.log('CSV file written successfully');
    } catch (error) {
        console.error('Error exporting to CSV:', error.message);
    }
}

module.exports = {
    uploadCSVHelper, exportToCSV
};
