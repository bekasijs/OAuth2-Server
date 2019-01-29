const router = require('express').Router();
const {passport} = appRoot('src/lib/Passport');
const { authenticateHandler, generateToken } = appRoot('src/lib/OAuth');

router.use('/admin', passport.authenticate('basic', { session: false }), require('./admin')); // Admin
router.use('/merchant', passport.authenticate('basic', { session: false }), require('./merchant')); // Client or Merchant or Outlet
router.use('/customer', passport.authenticate('basic', { session: false }), require('./customer')); // Customer or Users
router.all('/token', generateToken()); // Generate token

module.exports = router;