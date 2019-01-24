const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

let now = {
  iso: moment().tz('Asia/Jakarta').format(),
  timestamp: moment().tz('Asia/Jakarta').unix()
}

const ClientSchema = new Schema({
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
  scope: {
    type: Array,
  },
  createdAt: {
    type: Schema.Types.Mixed,
    default: now
  },
  updatedAt: {
    type: Schema.Types.Mixed
  }
});

ClientSchema.statics.create = () => {
  
}

module.exports = mongoose.model('clients', ClientSchema);