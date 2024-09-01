const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    requestId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Completed', 'Failed'], default: 'Pending' },
    productData: [
        {
            serialNumber: Number,
            productName: String,
            inputImageUrls: [String],
            outputImageUrls: [String],
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);