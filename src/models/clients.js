const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

const ClientSchema = new Schema({
  platform: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  redirectUris: {
    type: String,
  },
  clientId: {
    type: String,
    required: true
  },
  clientSecret: {
    type: String,
    required: true
  },
  grants: {
    type: Array,
    required: true
  },
  scopes: {
    type: Array,
  },
  createdAt: {
    type: Schema.Types.Mixed,
  },
  updatedAt: {
    type: Schema.Types.Mixed
  }
});

ClientSchema.statics.create = () => {
  
}

module.exports = mongoose.model('clients', ClientSchema);