
const Joi = require('joi');
const Error = require('../../lib/Error').errorValidation;
const response = require('../../helpers/response').json;
const { clients } = appRoot('src/controllers');

module.exports = (mongodb) => {
  return (req, res, next) => {

    const platform = req.user;
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      grants: Joi.array().items(Joi.string()),
      scope: Joi.array(),
    });

    const Client = new clients(platform, mongodb);

    Joi.validate(req.body, schema)
      .then(params => { return Client.create(params)})
      .then(response(res, 201))
      .catch(Error);

  }
}

exports.test = () => {
  return 'TEST';
}

exports.test01 = () => {
  return 'TEST01'
}