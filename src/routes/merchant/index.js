
const router = require('express').Router();
const passport = appRoot('src/lib/Passport').passport;

module.exports = (mongodb) => {

  router.post('/', require('./create')(mongodb));

  return router;

}