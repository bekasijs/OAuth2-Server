const mongoose = require('mongoose');
const config = require('config');
const Models = require('./../models');

module.exports = (cb) => {

  mongoose.connect(config.get('mongodb.uri'), { useNewUrlParser: true, useCreateIndex: true }, (error, db) => {

    if (error) {

      console.error('Failed connecting to database mongodb', error);
      cb(error);

    }

    console.info('Successfully connecting to database mongodb');
     
    cb(null, Models);

  });

}