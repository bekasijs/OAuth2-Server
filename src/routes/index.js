const router = require('express').Router();

router.use('/admin', authenticateHandler(), require('./admin'));
router.use('/merchant', authenticateHandler(), require('./merchant'));
router.use('/customer', authenticateHandler(), require('./customer'));

module.exports = router;