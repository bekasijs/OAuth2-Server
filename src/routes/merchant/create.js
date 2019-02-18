
const Joi = require('joi');
const response = appRoot('src/helpers/response').json;
const Merchant = appRoot('src/controllers/merchants');

module.exports = (mongodb) => {
  return (req, res, next) => {
    
    const schema = Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().regex(/[a-zA-Z]/).min(8)
    });

    let merchant = new Merchant(req.user, mongodb);

    Joi.validate(req.body, schema)
    .then(params => merchant.create(params))
    .then(response(res, 201))
    .catch(next);

  }
}