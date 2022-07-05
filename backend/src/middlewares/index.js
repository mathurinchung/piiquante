const auth = require('./auth.middleware');
const upload = require('./upload.middleware')
const errorHandler = require('./errors.middleware');

module.exports = { auth, upload, errorHandler };
