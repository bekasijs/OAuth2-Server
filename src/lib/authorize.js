
const fs = require('fs');
const oauth2orize = require('oauth2orize');
const oauth2 = oauth2orize.createServer();
const redis = require('./../adapters/redis');
const db = appRoot('/src/models');
const jwt = require('jsonwebtoken');

const { decrypt } = appRoot('src/lib/password');
const _ = require('lodash');

oauth2.exchange(new oauth2orize.exchange.refreshToken((client, refreshToken, scopes, done) => {
  db.clients.findOne({
    clientId: client.clientId
  }, async (error, Client) => {

    if (error) done(error);
    if (!Client) done('Client not found', false);
    if (Client.clientSecret !== client.clientSecret) return done('Client secret not valid', false);

    // return jwt.verify()

  });
}));

oauth2.exchange(new oauth2orize.exchange.clientCredentials((client, scope, done) => {
  db.clients.findOne({
    clientId: client.clientId,
  }, async (error, localClient) => {
    if (error) return done(error);
    if (!localClient) return done(null, false);
    if (localClient.clientSecret !== client.clientSecret) return done(null, false);

    const PRIVATE_KEY = fs.readFileSync('private.key', 'utf8');

    const payload = {
      clientId: localClient._id,
    };

    const signOptions = {
      issuer: client.name,
      audience: client._id,
      expiresId: '8h',
      algorithm: 'RS256'
    }

    const tokenValue = jwt.sign(payload, PRIVATE_KEY, signOptions);

    done(null, tokenValue);

  });
}));

oauth2.exchange(new oauth2orize.exchange.password((client, username, password, scope, done) => {
  db.accounts.findOne({
    client: client._id,
    identifier: [username],
  }, (error, account) => {
    if (error) return done(error);
    if (!account) return done({ code: 400, message: 'User not found' });
    if (!decrypt(password, account)) return done({ code: 400, message: 'Oops, Wrong Password' });
    if (!_.intersection(account.scopes, scope)) return done({ code: 403, message: 'Insufficient privileges to complete the operation.' });

    db.profiles.findOne({
      account: account._id,
      email: username
    }, async (error, profile) => {
      if (error) return done(error);
      if (!profile) return done({ code: 400, message: 'Profile not found' });

      const PRIVATE_KEY = fs.readFileSync('private.key', 'utf8');
      const PUBLIC_KEY = fs.readFileSync('public.key', 'utf8');

      const payload = {
        accountId: account._id,
        email: profile.email
      };

      const RefPayload = {
        iss: String(client._id),
        accountId: account._id
      }

      const token = jwt.sign(payload,
        'PRIVATE', { algorithm: 'HS256', audience: String(client._id), expiresIn: '8h', issuer: 'http://localhost:9000/' });
      const refreshToken = jwt.sign(RefPayload,
        'PRIVATE', { algorithm: 'HS256', expiresIn: '7d' });

      done(false, token, refreshToken);
    }).lean();

  }).lean();
}));

module.exports = oauth2;