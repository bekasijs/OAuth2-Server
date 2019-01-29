const { authenticateHandler } = appRoot('/src/lib/OAuth');
const  { authentication } = appRoot('/src/validators');
const router = require('express').Router();

router.post('/', require('./create'));

module.exports = router;