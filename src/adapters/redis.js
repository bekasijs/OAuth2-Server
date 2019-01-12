const redis = require('redis').createClient({
  host: process.env.REDIS_HOST,
  port: 6379,
  db: 0
});

module.exports = redis;