const redis = require('./../adapters/redis');
const node_acl = require('acl');
let acl = new node_acl(new node_acl.redisBackend(redis, '_acl'));

module.exports = acl;