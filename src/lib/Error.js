
const errorValidation = (params) => {
  let { name, details } = params;
  let response = {
    code: 400,
    statusCode: 400,
    name: name,
    message: []
  }
  details.forEach((msg, i) => {
    response.message.push({ error: `${msg.path[0]} is required` })
  });
  return response;
}

const errorJson = (statusCode, name=false, message=false) => {
  let error = new Error();
  if (name) error.name = name;
  if (message) error.message = message
  if (statusCode) {
    error.code = statusCode;
    error.statusCode = statusCode;
  }
  return error;
}

module.exports = {
  errorValidation,
  errorJson
}
