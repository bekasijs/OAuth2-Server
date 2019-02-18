
const router = require('express').Router();

module.exports = (mongodb) => {

  router.post('/', require('./create')(mongodb));

  return router;

}