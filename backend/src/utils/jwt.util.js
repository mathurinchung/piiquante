const jwt = require('jsonwebtoken');

exports.generateAccessToken = (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
