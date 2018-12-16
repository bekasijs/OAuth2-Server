const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('AUTH_SERVER:MONGODB');
const Models = require('./../models');
const node_acl = require('acl');

module.exports = (cb) => {

  mongoose.connect(config.get('mongodb.uri'), { useNewUrlParser: true, useCreateIndex: true }, (error, db) => {

    if (error) {

      debug('Failed connecting to database mongodb', error);
      cb(error);

    }

    debug('Successfully connecting to database mongodb');

    let acl = new node_acl(new node_acl.mongodbBackend(db, '_acl'));
     
    cb(null, Models, acl);

  });

}