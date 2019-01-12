const { OAuth, authenticateHandler, generateToken } = require('./../lib/OAuth');
const debug = require('debug')('AUTH_SERVER:OAUTH');
const { Clients, Accounts } = require('./../controllers');
const Request = require('oauth2-server').Request;
const Response = require('oauth2-server').Response;
const router = require('express').Router();
const util = require('util');

module.exports = (db) => {

  router.post('/register', authenticateHandler(), (req, res, next) => {

    let Controller = new Accounts(db);

    Controller.register(Object.assign({}, req.body, res.locals.oauth)).then(result => {
      return res.status(201).json({ data: result });
    }).catch(next);

  });

  router.all('/token', generateToken());

  router.post('/authenticate', authenticateHandler());
  router.get('/authorize', (req, res, next) => {
    if (!req.locals) {
      return res.redirect(util.format(`/oauth/login?client_id=${req.query.client_id}&redirectUri=${req.query.redirectUri}&response_type=code&scope=${req.query.scope}`))
    } else {
      return res.redirect(util.format(`/oauth/register?client_id=${req.query.client_id}&redirectUri=${req.query.redirectUri}&response_type=code&scope=${req.query.scope}`));
    }
  });

  router.post('/authorize', (req, res, next) => {

    let request = new Request(req);
    let response = new Response(res);

    OAuth.authorize(request, response, {
      authenticateHandler: {
        handle: (req, res) => {
          let accounts = new Accounts(db);

          accounts.login(req.body)
            .then(result => {
              return result
            });
        }
      },
      authorizationCodeLifetime: 1440
    })
      .then((code) => {
        return res.json(code);
      })
      .catch(next);

  });

  router.post('/client', (req, res, next) => {

    let Controller = new Clients(db);

    Controller.create(req.body).then(result => {
      return res.status(201).json(result);
    }).catch(next);

  });

  return router;

}