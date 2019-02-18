const router = require('express').Router();
const { passport } = appRoot('/src/lib/Passport');
const { authenticate, generateToken, checkAuth } = appRoot('/src/lib/OAuth');
const oauth2 = appRoot('src/lib/authorize');

module.exports = (mongodb) => {

  router.all('/token', passport.authenticate(['basic', 'oauth2-client-password'], { session: false }), generateToken());
  router.all('/authenticate', authenticate(), checkAuth); 

  // router.use('/admin', 
  //   passport.authenticate(['basic'], { session: false }), 
  //   require('./admin')(mongodb)); // Admin

  router.use('/merchant', 
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }), 
    require('./merchant')(mongodb)); // Client or Merchant or Corporate Outlet

  // router.use('/customer', 
  //   passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  //   require('./customer')(mongodb)); // Customer or Users

  router.use('/clients', passport.authenticate(['basic'], { session: false }), require('./clients')(mongodb));

  return router;

};