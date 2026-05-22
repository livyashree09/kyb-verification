const Joi = require('joi');

// ---------------------------------------------------------------------------
// Format patterns
// ---------------------------------------------------------------------------
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const CIN_REGEX = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
const LLPIN_REGEX = /^[A-Z]{3}-[0-9]{4}$/;

// ---------------------------------------------------------------------------
// Joi schemas per business type
// ---------------------------------------------------------------------------

const soleProprietorshipSchema = Joi.object({
  businessType: Joi.string().valid('sole_proprietorship').required(),
  pan: Joi.string().uppercase().pattern(PAN_REGEX).required().messages({
    'string.pattern.base': 'PAN must be in format ABCDE1234F',
    'any.required': 'PAN is mandatory for Sole Proprietorship',
    'string.empty': 'PAN is mandatory for Sole Proprietorship',
  }),
  gstin: Joi.string().uppercase().pattern(GSTIN_REGEX).required().messages({
    'string.pattern.base': 'GSTIN must be a valid 15-character GST number',
    'any.required': 'GSTIN is mandatory for Sole Proprietorship',
    'string.empty': 'GSTIN is mandatory for Sole Proprietorship',
  }),
  cin: Joi.string().allow('', null).optional(),
  llpin: Joi.string().allow('', null).optional(),
});

const partnershipFirmSchema = Joi.object({
  businessType: Joi.string().valid('partnership_firm').required(),
  pan: Joi.string().uppercase().pattern(PAN_REGEX).required().messages({
    'string.pattern.base': 'PAN must be in format ABCDE1234F',
    'any.required': 'PAN is mandatory for Partnership Firm',
    'string.empty': 'PAN is mandatory for Partnership Firm',
  }),
  gstin: Joi.string().uppercase().pattern(GSTIN_REGEX).required().messages({
    'string.pattern.base': 'GSTIN must be a valid 15-character GST number',
    'any.required': 'GSTIN is mandatory for Partnership Firm',
    'string.empty': 'GSTIN is mandatory for Partnership Firm',
  }),
  cin: Joi.string().allow('', null).optional(),
  llpin: Joi.string().allow('', null).optional(),
});

const llpSchema = Joi.object({
  businessType: Joi.string().valid('llp').required(),
  llpin: Joi.string().uppercase().pattern(LLPIN_REGEX).required().messages({
    'string.pattern.base': 'LLPIN must be in format AAA-1234',
    'any.required': 'LLPIN is mandatory for LLP',
    'string.empty': 'LLPIN is mandatory for LLP',
  }),
  pan: Joi.string().uppercase().pattern(PAN_REGEX).required().messages({
    'string.pattern.base': 'PAN must be in format ABCDE1234F',
    'any.required': 'PAN is mandatory for LLP',
    'string.empty': 'PAN is mandatory for LLP',
  }),
  gstin: Joi.string().uppercase().pattern(GSTIN_REGEX).required().messages({
    'string.pattern.base': 'GSTIN must be a valid 15-character GST number',
    'any.required': 'GSTIN is mandatory for LLP',
    'string.empty': 'GSTIN is mandatory for LLP',
  }),
  cin: Joi.string().allow('', null).optional(),
});

const cinBasedSchema = (businessType) =>
  Joi.object({
    businessType: Joi.string().valid(businessType).required(),
    cin: Joi.string().uppercase().pattern(CIN_REGEX).required().messages({
      'string.pattern.base': 'CIN must be in format U12345TN2020PTC123456',
      'any.required': `CIN is mandatory for ${businessType.replace(/_/g, ' ')}`,
      'string.empty': `CIN is mandatory for ${businessType.replace(/_/g, ' ')}`,
    }),
    pan: Joi.string().uppercase().pattern(PAN_REGEX).required().messages({
      'string.pattern.base': 'PAN must be in format ABCDE1234F',
      'any.required': `PAN is mandatory for ${businessType.replace(/_/g, ' ')}`,
      'string.empty': `PAN is mandatory for ${businessType.replace(/_/g, ' ')}`,
    }),
    gstin: Joi.string().uppercase().pattern(GSTIN_REGEX).required().messages({
      'string.pattern.base': 'GSTIN must be a valid 15-character GST number',
      'any.required': `GSTIN is mandatory for ${businessType.replace(/_/g, ' ')}`,
      'string.empty': `GSTIN is mandatory for ${businessType.replace(/_/g, ' ')}`,
    }),
    llpin: Joi.string().allow('', null).optional(),
  });

const SCHEMA_MAP = {
  sole_proprietorship: soleProprietorshipSchema,
  partnership_firm: partnershipFirmSchema,
  llp: llpSchema,
  private_limited_company: cinBasedSchema('private_limited_company'),
  public_limited_company: cinBasedSchema('public_limited_company'),
  opc: cinBasedSchema('opc'),
};

// ---------------------------------------------------------------------------
// Validator middleware factory
// ---------------------------------------------------------------------------

/**
 * Validates the KYB request body.
 * First checks businessType, then applies the schema for that type.
 */
const validateKYBRequest = (req, res, next) => {
  const { businessType } = req.body;

  if (!businessType) {
    return res.status(400).json({
      success: false,
      message: 'businessType is required',
    });
  }

  const schema = SCHEMA_MAP[businessType];

  if (!schema) {
    return res.status(400).json({
      success: false,
      message: `Invalid businessType. Allowed values: ${Object.keys(SCHEMA_MAP).join(', ')}`,
    });
  }

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    convert: true,
  });

  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.validatedBody = value;
  next();
};

// ---------------------------------------------------------------------------
// Individual document validators (for standalone endpoints)
// ---------------------------------------------------------------------------

const validatePAN = (req, res, next) => {
  const schema = Joi.object({
    pan: Joi.string().uppercase().pattern(PAN_REGEX).required().messages({
      'string.pattern.base': 'PAN must be in format ABCDE1234F',
      'any.required': 'PAN is required',
    }),
  });

  const { error, value } = schema.validate(req.body, { convert: true });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  req.validatedBody = value;
  next();
};

const validateGST = (req, res, next) => {
  const schema = Joi.object({
    gstin: Joi.string().uppercase().pattern(GSTIN_REGEX).required().messages({
      'string.pattern.base': 'GSTIN must be a valid 15-character GST number',
      'any.required': 'GSTIN is required',
    }),
  });

  const { error, value } = schema.validate(req.body, { convert: true });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  req.validatedBody = value;
  next();
};

const validateCIN = (req, res, next) => {
  const schema = Joi.object({
    cin: Joi.string().uppercase().pattern(CIN_REGEX).required().messages({
      'string.pattern.base': 'CIN must be in format U12345TN2020PTC123456',
      'any.required': 'CIN is required',
    }),
  });

  const { error, value } = schema.validate(req.body, { convert: true });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  req.validatedBody = value;
  next();
};

const validateLLPIN = (req, res, next) => {
  const schema = Joi.object({
    llpin: Joi.string().uppercase().pattern(LLPIN_REGEX).required().messages({
      'string.pattern.base': 'LLPIN must be in format AAA-1234',
      'any.required': 'LLPIN is required',
    }),
  });

  const { error, value } = schema.validate(req.body, { convert: true });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  req.validatedBody = value;
  next();
};

module.exports = {
  validateKYBRequest,
  validatePAN,
  validateGST,
  validateCIN,
  validateLLPIN,
};
