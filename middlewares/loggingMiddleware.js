const loggingMiddleware = (req, res, next) => {
  console.log('Request Received', req.url, req.method, req.body);
  next();
};

module.exports = {
  loggingMiddleware
};