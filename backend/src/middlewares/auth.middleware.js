const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization && request.headers.authorization.split(' ')[1];
    if (!token) throw createError(403, "a token is required for authentication");

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (request.body.userId && request.body.userId !== decoded.userId) throw createError(401, "authorization denied");

    const userId = decoded.userId
    request.auth = { userId };

    next();
  } catch (error) {
    next(error);
  }
};
