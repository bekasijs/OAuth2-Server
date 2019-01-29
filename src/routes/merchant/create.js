
const Joi = require('joi');
const Merchant = require('./../../controllers/Merchants');
const response = appRoot('src/helpers/response');
const models = require('./../../models');

module.exports = (req, res, next) => {

  const schema = Joi.object().keys({
    identifier: Joi.string().required(),
    password: Joi.string().required(),
    roles: Joi.string().default('Merchant')
  });

  const result = Joi.validate(req.body, schema);

  if (result.error) next(result.error);

  let merchant = new Merchant(req.user, models);

  merchant.create(result.value)
  .then(response.json(res, 201))
  .catch(next);

};