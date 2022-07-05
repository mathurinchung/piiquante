module.exports = (error, request, response, next) => {
  const status = error.status || 500;
  const message = error.message || "something went wrong";

  response.status(status).json({ error: message });
}
