const express = require('express');

const router = express.Router();

const paymentLogController = require('../controllers/paymentLog');

router.post('/save-data', paymentLogController);

module.exports = router;