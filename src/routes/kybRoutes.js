const express = require('express');
const router = express.Router();
const { verifyKYB } = require('../controllers/kybController');
const { validateKYBRequest } = require('../validators/kybValidator');

/**
 * POST /api/kyb/verify
 * Overall KYB verification endpoint.
 * Validates required fields based on businessType before calling Sandbox APIs.
 */
router.post('/verify', validateKYBRequest, verifyKYB);

module.exports = router;
