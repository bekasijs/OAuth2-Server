const OAuthServer = require('oauth2-server');
const {Request, Response} = require('oauth2-server');
const Models = require('./Models');

let OAuth = new OAuthServer({
  model: new Models(),
  grants: ['client_credentials', 'refresh_token', 'authorization_code', 'password'],
  allowEmptyState: true,
  accessTokenLifetime: 86400
});

const generateToken = (options => {
  return function(req, res, next) {
    let request = new Request(req);
    let response = new Response(res);
    return OAuth.token(request, response, options)
      .then(function(token) {
        res.status(200).json(token);
      })
      .catch(next);
  }
});

const authorizeHandler = (options => {
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
});

const authenticate = (options => {
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
});

const checkAuth = (req, res, next) => {

  if (!res.locals.oauth) {
    res.statusCode = 403;
    res.json({ isActive: false });
  }

  res.statusCode = 200;
  res.json({ isActive: true, ...res.locals.oauth });

}

module.exports = {
  authorizeHandler,
  authenticate,
  generateToken,
  checkAuth
}