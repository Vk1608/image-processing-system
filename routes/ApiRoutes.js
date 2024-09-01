const apiRoutes = require('express')();
const multer = require('multer');
const { uploadCSV, getJobStatus, webhookAction } = require('../controller/ImageController');
const { validateUploadCSVPayload, validateJobStatusParam, validateWebhookPayload } = require('../middleWare/Validation');
var uploadFile = multer({ dest: "./uploads/" });

apiRoutes.post('/v1/upload', uploadFile.single('file'), validateUploadCSVPayload, uploadCSV)
apiRoutes.get('/v1/status/:requestId', validateJobStatusParam, getJobStatus);

apiRoutes.post('/v1/webhook', validateWebhookPayload, webhookAction);

module.exports = apiRoutes;
