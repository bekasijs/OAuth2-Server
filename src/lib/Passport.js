const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const Client = appRoot('/src/models').clients;

passport.use(new BasicStrategy(
  (clientId, clientSecret, done) => {
    Client.findOne({ clientId: clientId }, (err, client) => {
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