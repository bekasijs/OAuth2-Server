const OAuth2 = require('oauth2-server/lib/errors/unauthorized-client-error')
const redis = require('./../adapters/redis');
const moment = require('moment-timezone');
const Models = require('./../models');
const crypto = require('crypto');
const _ = require('lodash');

class Model {

  constructor() {
    this.getClient = this.getClient
    this.getUserFromClient = this.getUserFromClient;
    this.getAccessToken = this.getAccessToken;
    this.getAuthorizationCode = this.getAuthorizationCode;
    this.getRefreshToken = this.getRefreshToken;
    this.revokeAuthorizationCode = this.revokeAuthorizationCode;
    this.revokeToken = this.revokeToken;
    this.saveToken = this.saveToken;
    this.saveAuthorizationCode = this.saveAuthorizationCode;
    this.verifyScope = this.verifyScope;
    this.validateScope = this.validateScope;
  }

  async getRefreshToken(refreshToken) {
    try {

      return Models.refreshTokens.findOne({ refreshToken: refreshToken })
        .populate(['client', 'account'])
        .lean()
        .then(result => {

          let data = {
            client: result.client,
            user: result.account,
            refreshToken: result.refreshToken,
            refresh_token: result.refreshToken,
            refreshTokenExpiresAt: new Date(result.refreshTokenExpiresAt),
            scope: result.scope ? result.scope : []
          }

          data.client.id = `${data.client._id}`;

          return data;

        })
      
    } catch (error) {
      throw new OAuth2(error);
    }
  }

  async getAccessToken(accessToken) {
    try {

      return Models.accessTokens.findOne({ accessToken: accessToken })
        .populate(['client', 'account'])
        .lean()
        .then(token => {
 
          delete token.client.clientSecret;
          delete token.account.password;
          delete token.account.salt;

          token = Object.assign({}, token, { user: token.account });

          delete token.account;

          token.accessTokenExpiresAt = new Date(token.accessTokenExpiresAt);

          return token;
        })
        .catch(error => {
          throw new OAuth2(error);
        })

    } catch (error) {
      throw new OAuth2(error);
    }
  }

  async getAuthorizationCode(authorizationCode) {
    try {

      Models.authorizationCode.findOne({ authorizationCode: authorizationCode })
        .populate(['client', 'account'])
        .then(code => {
          return {
            code: code.authorizationCode,
            expiresAt: code.authorizationCodeExpiresAt,
            redirectUri: code.redirectUri,
            scope: code.scope,
            client: code.client,
            user: code.account
          }
        });

    } catch (error) {
      throw new OAuth2(error);
    }
  }

  async getClient(clientId, clientSecret) {
    try {

      let query = { clientId: clientId };

      if (clientSecret) {
        query.clientSecret = clientSecret;
      }

      return Models.clients.findOne(query)
        .lean()
        .then(client => {

          client.id = `${client._id}`;
          return client

        });

    } catch (error) {
      throw new OAuth2(error);
    }
  }

  async getUser(identifier, password) {
    try {

      let account = await Models.accounts.findOne({ identifier: [identifier] });

      if (!account) throw new OAuth2('Account not registered', {
        code: 400,
        name: 'account_not_registered'
      })

      if (this.validateHash(password, account)) return account;
      else throw new OAuth2('Oops, Wrong password', {
        code: 400,
        name: 'wrong_password'
      });

    } catch (error) {
      throw new OAuth2(error);
    }
  }

  async getUserFromClient(client) {
    try {

      return await Models.accounts.findOne({ client: client._id });

    } catch (error) {
      throw new OAuth2(error);
    }
  }

  async revokeAuthorizationCode(authorizationCode) {
    try {
      
      return Models.authorizationCode.deleteOne({ authorizationCode: authorizationCode })
        .then(code => {
          return !code;
        })

    } catch (error) {
      throw new OAuth2(error);
    }
  }

  async saveToken(token, client, user) {
    try {

      let SaveToken = async (token, client, user) => {
        let accessToken = new Models.accessTokens();
        accessToken.accessToken = token.accessToken;
        accessToken.accessTokenExpiresAt = token.accessTokenExpiresAt;
        accessToken.client = client._id;
        accessToken.account = user._id;
        accessToken.scope =  token.scope;
        accessToken = await accessToken.save();
        return await Models.accessTokens.findById(accessToken._id).select(['-_id']).lean();
      }

      let SaveRefToken = async (token, client, user) => {
        let refreshToken = new Models.refreshTokens();
        refreshToken.refreshToken = token.refreshToken;
        refreshToken.refreshTokenExpiresAt = token.refreshTokenExpiresAt
        refreshToken.client = client._id;
        refreshToken.account = user._id;
        refreshToken.scope = token.scope;
        refreshToken = await refreshToken.save();
        return await Models.refreshTokens.findById(refreshToken._id).select(['-_id']).lean();
      }

      return Promise.all([
        SaveToken(token, client, user),
        token.refreshToken ? SaveRefToken(token, client, user) : []
      ]).then(result => {

        const store = _.assign(
          {
            client: client,
            user: user,
            access_token: token.accessToken, // proxy
            refresh_token: token.refreshToken, // proxy
          },
          token
        )

        redis.SETEX('access_token:'+token.accessToken, 86400, JSON.stringify(store));
        redis.SETEX('refresh_token:'+token.refreshToken, 86400, JSON.stringify(store));

        return store;

      })
      .catch(error => {
        throw new OAuth2(error);
      })

    } catch (error) {
      throw new OAuth2(error);
    }
  }

  async saveAuthorizationCode(code, client, user) {
    try {
      
      let authCode = {
        authorizationCode: code.authorizationCode,
        authorizationCodeExpiresAt: new Date(code.expiresAt),
        redirectUri: code.redirectUri,
        scope: code.scope,
        client: client._id,
        account: user._id
      }

      let authorizationCode = new Models.authorizationCode(authCode);

      authorizationCode = await authorizationCode.save();

      const store = {
        authorizationCode: authorizationCode.authorizationCode,
        authorizationCodeExpiresAt: authorizationCode.authorizationCodeExpiresAt,
        redirectUri: authorizationCode.redirectUri,
        scope: authorizationCode.scope,
        client: client._id,
        account: user._id
      }

      redis.SETEX('authorization_code:'+code.authorizationCode, 86400, JSON.stringify(store));

      return store;

    } catch (error) {
      throw new OAuth2(error);
    }
  }

  async revokeToken(token) {
    try {

      return Models.refreshTokens.deleteOne({ refreshToken: token.refreshToken })
        .then(result => {
          return !!result
        });

    } catch (error) {
      throw new OAuth2(error);
    }
  }

  verifyScope(token, scope) {
    return token.scope === scope
  }

  validateScope(user, client, scope) {
    if (!scope.split(/,\s*/).every(s => client.scope.indexOf(s))) {
      return false;
    }
    return scope;
  }

  validateHash(password, param) {
    let validate = crypto.createHmac('sha1', param.salt).update(password).digest('hex');
    if (validate !== param.password) return false;
    else return true;
  }

}

module.exports = Model;