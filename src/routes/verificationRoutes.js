const express = require('express');
const router = express.Router();
const { 
  checkPAN, checkGST, checkCIN, checkLLPIN, checkDigilocker,
  initDigilockerSession, getDigilockerSessionStatus, 
  getDigilockerUserProfile, getDigilockerDocuments
} = require('../controllers/verificationController');
const { 
  validatePAN, validateGST, validateCIN, validateLLPIN, validateDigilocker,
  validateInitiateSession, validateSessionId
} = require('../validators/kybValidator');

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

/**
 * POST /api/verify/digilocker
 * Standalone Digilocker user verification.
 * Body: { "mobile": "9876543210" }
 */
router.post('/digilocker', validateDigilocker, checkDigilocker);

/**
 * POST /api/verify/digilocker/sessions/init
 * Initiate a Digilocker session
 * Body: { "mobile": "9876543210", "flow": "signin", "redirectUrl": "https://example.com", "docTypes": ["aadhaar"] }
 */
router.post('/digilocker/sessions/init', validateInitiateSession, initDigilockerSession);

/**
 * GET /api/verify/digilocker/sessions/:sessionId/status
 * Get the status of a Digilocker session
 */
router.get('/digilocker/sessions/:sessionId/status', validateSessionId, getDigilockerSessionStatus);

/**
 * GET /api/verify/digilocker/sessions/:sessionId/user/profile
 * Get user profile from a Digilocker session
 */
router.get('/digilocker/sessions/:sessionId/user/profile', validateSessionId, getDigilockerUserProfile);

/**
 * GET /api/verify/digilocker/sessions/:sessionId/documents/:documentType
 * Fetch documents from a Digilocker session
 * documentType: aadhaar, pan, driving_license, etc.
 */
router.get('/digilocker/sessions/:sessionId/documents/:documentType', validateSessionId, getDigilockerDocuments);

module.exports = router;
