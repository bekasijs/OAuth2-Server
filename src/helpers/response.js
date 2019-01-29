
exports.json = (response, statusCode) => {
  statusCode = statusCode || 200;
  return (result) => {
    response.status(statusCode).json({ data: result });
  }
};