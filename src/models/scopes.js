const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScopeSchema = new Schema({
  client: {type: Schema.Types.ObjectId},
  roles: {type: String},
  scopes: {type: String}
});

module.exports = mongoose.model('scopes', ScopeSchema);