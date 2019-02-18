
const config = require('config');
const Error = appRoot('src/lib/Error').errorJson;
const randomBytes = appRoot('src/lib/generatE_client');

class clients {

  constructor(user=false, db) {
    this.user = user;
    this.db = db;
  }

  async create ({ name, grants, scopes=false, role }) {
    try {

      scopes = config.get(role).scope || scopes ;

      let client = new this.db.clients({ name, grants, scopes });

      if (!this.user) throw Error(400, 'ClientNotFound', 'Client Not Found');

      client.platform = this.user._id;
      client.clientSecret = await randomBytes();
      client.clientId = await randomBytes();

      await client.save();

      client = await this.db.clients.findById(client._id).select(['-platform']);

      return client;

    } catch (error) {
      throw error;
    }
  }

}

module.exports = clients;