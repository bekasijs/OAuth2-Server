const Joi = require('joi');
const Accounts = require('./../../controllers/Accounts');
const models = require('./../../models');

module.exports = (req, res, next) => {

  const schema = Joi.object().keys({
    identifier: Joi.string().required(),
    password: Joi.string().required(),
    roles: Joi.string().default('Customer')
  });

  const result = Joi.validate(req.body, schema);

  if (result.error) throw next(result.error);

  let customer = new Accounts(res.locals.oauth, models);

  customer.register(result.value).then(result => {
    return res.status(201).json({ data: result });
  }).catch(next);

}