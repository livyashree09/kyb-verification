const { verifyPAN } = require('../services/panService');
const { verifyGST } = require('../services/gstService');
const { verifyCIN } = require('../services/cinService');
const { verifyLLPIN } = require('../services/llpinService');

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

module.exports = { checkPAN, checkGST, checkCIN, checkLLPIN };
