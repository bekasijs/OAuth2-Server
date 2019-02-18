const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientStrategy = require('passport-oauth2-client-password').Strategy;
const db = appRoot('/src/models');

passport.use(new BasicStrategy(
  (clientId, clientSecret, done) => {
    db.clients.findOne({ clientId: clientId }, (err, client) => {
      if (err) return done(err);
      if (!client) return done(null, false);
      if (client.clientSecret != clientSecret) return done(null, false);
      return done(null, client, { scope: client.scope });
    });
  }
));

passport.use(new ClientStrategy(
  (clientId, clientSecret, done) => {
    db.clients.findOne({ clientId: clientId }, (err, client) => {
      if (err) return done(err);
      if (!client) return done(null, false);
      if (client.clientSecret != clientSecret) return done(null, false);
      return done(null, client);
    });
  }
));

module.exports = {
  passport
}