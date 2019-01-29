const OAuthServer = require('oauth2-server');
const {Request, Response} = require('oauth2-server');
const Joi = require('joi');
const Models = require('./Models');

let OAuth = new OAuthServer({
  model: new Models(),
  grants: ['authorization_code', 'password', 'refresh_token', 'client_credentials'],
  allowEmptyState: true,
  accessTokenLifetime: 86400
});

function generateToken(options) {
  return function(req, res, next) {
    let request = new Request(req);
    let response = new Response(res);
    return OAuth.token(request, response, options)
      .then(function(token) {
        res.status(200).json(token);
      })
      .catch(next);
  }
}

function authorizeHandler(options) {
  return function(req, res, next) {
    if (req.locals.oauth) {
      return res.redirect(`authorize?path=${req.body.path}
          &client_id=${req.body.client_id}
          &response_type=${req.body.response_type ? res.body.response_type : 'code'}
          &scope${req.body.scope ? req.body.scope : 'profile:read'}`
        );
    }
    let request = new Request(req);
    let response = new Response(res);
    return OAuth.authorize(request, response, options)
      .then(function(code) {
        res.locals.oauth = {code: code};
        next();
      })
      .catch(next);
  }
}

function authenticateHandler(options) {
  return function(req, res, next) {
    let request = new Request(req);
    let response = new Response(res);
    return OAuth.authenticate(request, response, options)
      .then(function(code) {
        res.locals.oauth = code;
        next();
      })
      .catch(next);
  }
}

module.exports = {
  OAuth,
  authorizeHandler,
  authenticateHandler,
  generateToken
}