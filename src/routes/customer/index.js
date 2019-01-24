const { generateToken, authenticateHandler } = appRoot('/src/lib/OAuth');
const  { authentication } = appRoot('/src/validators');
const router = require('express').Router();

router.post('/', require('./create'));
router.all('/token', authentication('Customer'), generateToken());
router.post('/authenticate', authenticateHandler());

module.exports = router;