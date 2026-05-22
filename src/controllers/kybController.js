const { runKYBVerification } = require('../services/businessTypeVerificationService');

/**
 * POST /api/kyb/verify
 * Full KYB verification based on businessType.
 */
const verifyKYB = async (req, res, next) => {
  try {
    const result = await runKYBVerification(req.validatedBody);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { verifyKYB };
