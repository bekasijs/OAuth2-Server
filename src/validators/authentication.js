const Joi = require('joi');

module.exports = (roles) => {
  roles = roles || 'Users';
  return (req, res, next) => {
    const schema = Joi.object().keys({
      identifier: Joi.string().required(),
      password: Joi.string().required(),
      roles: Joi.string().default(roles)
    });

    const result = Joi.validate(req.body, schema);
    if (result.error) throw next(result.error);
    next();
  }
}