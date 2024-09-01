const { uploadCSVHelper } = require('../helper/ImageProcessor');
const { v4: uuidv4 } = require('uuid');
const Request = require('../models/Request');

async function uploadCSV(req, res) {
  try {
    const requestId = uuidv4();
    const { file } = req;
    await uploadCSVHelper({ file, requestId });
    return res.status(200).json({
      data: { requestId: requestId },
      message: 'CSV file uploaded successfully and processing started.'
    });
  } catch (error) {
    console.error('Error processing CSV file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getJobStatus(req, res) {
  try {
    const { requestId } = req.params;
    const request = await Request.findOne({ requestId: requestId });
    if (!request) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (request.status !== 'Completed') {
      return res.status(200).json({ requestId: request.requestId, status: request.status });
    }
    return res.status(200).json(request);
  } catch (error) {
    console.error('Error getting job status', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function webhookAction(req, res) {
  try {
    const { requestId } = req.requestId;
    const request = await Request.findOne({ requestId: requestId });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    if (request.status !== 'Completed') {
      return res.status(404).json({ error: "WebHook: Request couldn't Process Images" });
    }
    return res.status(200).json({message: `WebHook Action for ${requestId}`});
  } catch (error) {
    console.error('Error getting job status', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  uploadCSV,
  getJobStatus,
  webhookAction
};