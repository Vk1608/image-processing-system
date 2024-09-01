const Queue = require('bull');
const Request = require('../models/Request');
const sharp = require('sharp');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const imageProcessingQueue = new Queue('image-processing', 'redis://127.0.0.1:6379');
const axios = require('axios');

const processAndSaveImage = async (url, requestId) => {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const processedBuffer = await sharp(buffer)
        .jpeg({ quality: 50 })
        .toBuffer();
    const filename = `${uuidv4()}.jpg`;
    const outputPath = path.join(__dirname, '../public/processed_images', requestId);
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
    const filePath = path.join(outputPath, filename);
    fs.writeFileSync(filePath, processedBuffer);
    return `/processed_images/${requestId}/${filename}`;
};

async function triggerWebhook(payload) {
    const webhookUrl = 'http://localhost:5000/v1/webhook';
    try {
        await axios.post(webhookUrl, payload);
        console.log('Webhook triggered successfully');
    } catch (error) {
        console.error('Error triggering webhook:', error.message);
    }
}

imageProcessingQueue.process(async (job, done) => {
    const { requestId } = job.data;
    const request = await Request.findOne({ requestId });
    if (!request) return done(new Error('Request not found'));
    request.status = 'Processing';
    await request.save();
    const outputImageUrls = [];
    let checkIfCompleted = true;
    for (const product of request.productData) {
        const processedUrls = await Promise.all(
            product.inputImageUrls.map(async (url) => await processAndSaveImage(url, requestId))
        );
        outputImageUrls.push(processedUrls);
        if (processedUrls.length !== product.inputImageUrls.length) {
            checkIfCompleted = false;
        }
        product.outputImageUrls = processedUrls;
    }
    request.status = checkIfCompleted ? 'Completed' : 'Failed';
    request.save();
    await triggerWebhook(request);
    done();
});

module.exports = imageProcessingQueue;
