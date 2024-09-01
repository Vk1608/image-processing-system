const Request = require('../models/Request');
const fs = require('fs');
const csv = require('csv-parser');

async function validateUploadCSVPayload(req, res, next) {
    try {
        if (!req.file) {
            throw { status: 400, message: 'No file uploaded' };
        }
        const errors = [];
        const rows = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (row) => {
                if (!row['S. No.'] || !row['Product Name'] || !row['Input Image Urls']) {
                    errors.push(`Row ${row['S. No.']} is missing required fields.`);
                }
                rows.push(row);
            })
            .on('end', () => {
                if (errors.length > 0) {
                    return res.status(421).json({ errorList: errors, error: 'File Validation Error' });
                }
                next();
            });
    } catch (err) {
        const { status = 500, message = 'Internal Server Error' } = err;
        return res.status(status).json({ error: message });
    }
}

async function validateJobStatusParam(req, res, next) {
    try {
        const { requestId } = req.params;
        const request = await Request.findOne({ requestId });
        if (!request) {
            throw { status: 404, message: 'Request not Found' };
        }
        next();
    } catch (err) {
        const { status = 500, message = 'Internal Server Error' } = err;
        return res.status(status).json({ error: message });
    }
}

async function validateWebhookPayload(req, res, next) {
    try {
        const { requestId } = req.requestId;
        const request = await Request.findOne({ requestId });
        if (!request) {
            throw { status: 404, message: 'Request not Valid' };
        }
        next();
    } catch (err) {
        const { status = 500, message = 'Internal Server Error' } = err;
        return res.status(status).json({ error: message });
    }
}

module.exports = { validateUploadCSVPayload, validateJobStatusParam, validateWebhookPayload }
