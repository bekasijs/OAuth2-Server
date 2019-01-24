
module.exports = (statusCode, name=false, message=false) => {
  let error = new Error();
  if (name) error.name = name;
  if (message) error.message = message
  if (statusCode) {
    error.code = statusCode;
    error.statusCode = statusCode;
  }
  return error;
}