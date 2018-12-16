const redis = require('redis').createClient({
  host: process.env.REDIS_HOST,
  port: 6379
});

module.exports = redis;