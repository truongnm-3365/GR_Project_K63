const express = require('express')
const router = express.Router();

const {
    processPayment,
    sendStripApi,
    useConsumPoint
} = require('../controllers/paymentController')

const { isAuthenticatedUser } = require('../middlewares/auth')

router.route('/payment/process').post(isAuthenticatedUser, processPayment);
router.route('/payment/use-point').put(isAuthenticatedUser, useConsumPoint);
router.route('/stripeapi').get(isAuthenticatedUser, sendStripApi);

module.exports = router;