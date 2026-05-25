const { verifyPAN } = require('../services/panService');
const { verifyGST } = require('../services/gstService');
const { verifyCIN } = require('../services/cinService');
const { verifyLLPIN } = require('../services/llpinService');
const { verifyDigilocker } = require('../services/digilockerService');
const { initiateSession, getSessionStatus, getUserProfile, fetchDocuments } = require('../services/digilockerSessionService');

/**
 * POST /api/verify/pan
 */
const checkPAN = async (req, res, next) => {
  console.log("PAN route hit");
  console.log("req.body:", req.body);
  console.log("req.validatedBody:", req.validatedBody);

  try {
    const data = await verifyPAN(req.validatedBody.pan);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Controller Error:", err.message);
    next(err);
  }
};

/**
 * POST /api/verify/gst
 */
const checkGST = async (req, res, next) => {
  try {
    const data = await verifyGST(req.validatedBody.gstin);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/verify/cin
 */
const checkCIN = async (req, res, next) => {
  try {
    const data = await verifyCIN(req.validatedBody.cin);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/verify/llpin
 */
const checkLLPIN = async (req, res, next) => {
  try {
    const data = await verifyLLPIN(req.validatedBody.llpin);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/verify/digilocker
 */
const checkDigilocker = async (req, res, next) => {
  try {
    const data = await verifyDigilocker(req.validatedBody.mobile);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/digilocker/sessions/init
 * Initiate a Digilocker session
 */
const initDigilockerSession = async (req, res, next) => {
  try {
    const data = await initiateSession(req.validatedBody);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/digilocker/sessions/:sessionId/status
 * Get the status of a Digilocker session
 */
const getDigilockerSessionStatus = async (req, res, next) => {
  try {
    const { sessionId } = req.validatedParams;
    const data = await getSessionStatus(sessionId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/digilocker/sessions/:sessionId/user/profile
 * Get user profile from a Digilocker session
 */
const getDigilockerUserProfile = async (req, res, next) => {
  try {
    const { sessionId } = req.validatedParams;
    const data = await getUserProfile(sessionId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/digilocker/sessions/:sessionId/documents/:documentType
 * Fetch documents from a Digilocker session
 */
const getDigilockerDocuments = async (req, res, next) => {
  try {
    const { sessionId } = req.validatedParams;
    const { documentType } = req.params;
    const data = await fetchDocuments(sessionId, documentType);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { 
  checkPAN, 
  checkGST, 
  checkCIN, 
  checkLLPIN, 
  checkDigilocker,
  initDigilockerSession,
  getDigilockerSessionStatus,
  getDigilockerUserProfile,
  getDigilockerDocuments
};
