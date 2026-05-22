const express = require('express');
const router = express.Router();
const { checkPAN, checkGST, checkCIN, checkLLPIN } = require('../controllers/verificationController');
const { validatePAN, validateGST, validateCIN, validateLLPIN } = require('../validators/kybValidator');

/**
 * POST /api/verify/pan
 * Standalone PAN verification.
 * Body: { "pan": "ABCDE1234F" }
 */
router.post('/pan', validatePAN, checkPAN);

/**
 * POST /api/verify/gst
 * Standalone GST verification.
 * Body: { "gstin": "29ABCDE1234F1Z5" }
 */
router.post('/gst', validateGST, checkGST);

/**
 * POST /api/verify/cin
 * Standalone CIN verification.
 * Body: { "cin": "U12345TN2020PTC123456" }
 */
router.post('/cin', validateCIN, checkCIN);

/**
 * POST /api/verify/llpin
 * Standalone LLPIN verification.
 * Body: { "llpin": "AAA-1234" }
 */
router.post('/llpin', validateLLPIN, checkLLPIN);

module.exports = router;
