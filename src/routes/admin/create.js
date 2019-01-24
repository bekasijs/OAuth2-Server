
const Joi = require('joi');
const Admin = require('./../../controllers/Admins');
const models = require('./../../models');

module.exports = (req, res, next) => {

  const schema = Joi.object().keys({
    identifier: Joi.string().required(),
    password: Joi.string().required(),
    roles: Joi.string().default('Admin')
  });

  const result = Joi.validate(req.body, schema);

  if (result.error) next(result.error);

  let admin = new Admin(res.locals.oauth, models);

  admin.create(result.value).then(result => {
    return res.status(201).json({ data: result })
  }).catch(next);

};
