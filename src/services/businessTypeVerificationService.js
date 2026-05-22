const { verifyPAN } = require('./panService');
const { verifyGST } = require('./gstService');
const { verifyCIN } = require('./cinService');
const { verifyLLPIN } = require('./llpinService');

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

/**
 * Normalise a string for loose comparison (uppercase, trim, collapse spaces).
 */
const normalise = (str) => (str || '').toUpperCase().trim().replace(/\s+/g, ' ');

/**
 * Extract the embedded PAN from a 15-character GSTIN.
 * Positions 3–12 (0-indexed 2–11) carry the PAN.
 */
const extractPANFromGSTIN = (gstin) => gstin.substring(2, 12).toUpperCase();

/**
 * Shared name-match checker – returns true if at least one of the
 * nameFields from apiData loosely matches targetName.
 */
const namesMatch = (targetName, apiData, ...nameFields) => {
  const target = normalise(targetName);
  return nameFields.some((field) => {
    const value = normalise(apiData[field]);
    return value && (value.includes(target) || target.includes(value));
  });
};

// ---------------------------------------------------------------------------
// Individual business-type verification flows
// ---------------------------------------------------------------------------

/**
 * 1. Sole Proprietorship
 *    Required: PAN + GSTIN
 */
const verifySoleProprietorship = async ({ pan, gstin }) => {
  const results = {};

  // -- PAN --
  const panData = await verifyPAN(pan);
  results.pan = {
    verified: true,
    type: panData.type || panData.pan_type,
    name: panData.name || panData.full_name,
    status: panData.status,
  };

  // -- GST --
  const gstData = await verifyGST(gstin);
  results.gst = {
    verified: true,
    legalName: gstData.lgnm || gstData.legal_name,
    tradeName: gstData.tradeNam || gstData.trade_name,
    status: gstData.sts || gstData.status,
    gstin: gstData.gstin,
  };

  // -- Cross-checks --
  const panInGST = extractPANFromGSTIN(gstin);
  const panMatch = panInGST === pan.toUpperCase();

  const businessName = results.pan.name;
  const nameMatch = namesMatch(
    businessName,
    gstData,
    'lgnm',
    'legal_name',
    'tradeNam',
    'trade_name'
  );

  results.crossChecks = {
    panEmbeddedInGSTIN: panMatch,
    businessNameMatch: nameMatch,
  };

  const kybPassed = panMatch && nameMatch;

  return {
    businessType: 'sole_proprietorship',
    kybStatus: kybPassed ? 'VERIFIED' : 'FAILED',
    details: results,
  };
};

/**
 * 2. Partnership Firm
 *    Required: PAN + GSTIN
 */
const verifyPartnershipFirm = async ({ pan, gstin }) => {
  const results = {};

  const panData = await verifyPAN(pan);
  results.pan = {
    verified: true,
    type: panData.type || panData.pan_type,
    name: panData.name || panData.full_name,
    status: panData.status,
  };

  const gstData = await verifyGST(gstin);
  results.gst = {
    verified: true,
    legalName: gstData.lgnm || gstData.legal_name,
    tradeName: gstData.tradeNam || gstData.trade_name,
    status: gstData.sts || gstData.status,
    gstin: gstData.gstin,
  };

  const panInGST = extractPANFromGSTIN(gstin);
  const panMatch = panInGST === pan.toUpperCase();

  const entityName = results.pan.name;
  const nameMatch = namesMatch(
    entityName,
    gstData,
    'lgnm',
    'legal_name',
    'tradeNam',
    'trade_name'
  );

  results.crossChecks = {
    panEmbeddedInGSTIN: panMatch,
    entityNameMatch: nameMatch,
  };

  const kybPassed = panMatch && nameMatch;

  return {
    businessType: 'partnership_firm',
    kybStatus: kybPassed ? 'VERIFIED' : 'FAILED',
    details: results,
  };
};

/**
 * 3. LLP (Limited Liability Partnership)
 *    Required: LLPIN + PAN + GSTIN
 */
const verifyLLP = async ({ llpin, pan, gstin }) => {
  const results = {};

  const [llpData, panData, gstData] = await Promise.all([
    verifyLLPIN(llpin),
    verifyPAN(pan),
    verifyGST(gstin),
  ]);

  results.llpin = {
    verified: true,
    llpName: llpData.llpName || llpData.llp_name || llpData.entityName,
    status: llpData.llpStatus || llpData.status,
    llpin: llpData.llpin,
  };

  results.pan = {
    verified: true,
    type: panData.type || panData.pan_type,
    name: panData.name || panData.full_name,
    status: panData.status,
  };

  results.gst = {
    verified: true,
    legalName: gstData.lgnm || gstData.legal_name,
    tradeName: gstData.tradeNam || gstData.trade_name,
    status: gstData.sts || gstData.status,
    gstin: gstData.gstin,
  };

  const panInGST = extractPANFromGSTIN(gstin);
  const panMatch = panInGST === pan.toUpperCase();

  const llpName = results.llpin.llpName;

  const nameMatchPAN = namesMatch(llpName, panData, 'name', 'full_name');
  const nameMatchGST = namesMatch(
    llpName,
    gstData,
    'lgnm',
    'legal_name',
    'tradeNam',
    'trade_name'
  );

  results.crossChecks = {
    panEmbeddedInGSTIN: panMatch,
    llpNameMatchPAN: nameMatchPAN,
    llpNameMatchGST: nameMatchGST,
  };

  const kybPassed = panMatch && nameMatchPAN && nameMatchGST;

  return {
    businessType: 'llp',
    kybStatus: kybPassed ? 'VERIFIED' : 'FAILED',
    details: results,
  };
};

/**
 * 4. Private Limited Company
 *    Required: CIN + PAN + GSTIN
 */
const verifyPrivateLimited = async ({ cin, pan, gstin }) => {
  const results = {};

  const [cinData, panData, gstData] = await Promise.all([
    verifyCIN(cin),
    verifyPAN(pan),
    verifyGST(gstin),
  ]);

  results.cin = {
    verified: true,
    companyName: cinData.companyName || cinData.company_name,
    status: cinData.companyStatus || cinData.status,
    cin: cinData.cin,
  };

  results.pan = {
    verified: true,
    type: panData.type || panData.pan_type,
    name: panData.name || panData.full_name,
    status: panData.status,
  };

  results.gst = {
    verified: true,
    legalName: gstData.lgnm || gstData.legal_name,
    tradeName: gstData.tradeNam || gstData.trade_name,
    status: gstData.sts || gstData.status,
    gstin: gstData.gstin,
  };

  const panInGST = extractPANFromGSTIN(gstin);
  const panMatch = panInGST === pan.toUpperCase();

  const companyName = results.cin.companyName;

  const nameMatchPAN = namesMatch(companyName, panData, 'name', 'full_name');
  const nameMatchGST = namesMatch(
    companyName,
    gstData,
    'lgnm',
    'legal_name',
    'tradeNam',
    'trade_name'
  );

  results.crossChecks = {
    panEmbeddedInGSTIN: panMatch,
    companyNameMatchPAN: nameMatchPAN,
    companyNameMatchGST: nameMatchGST,
  };

  const kybPassed = panMatch && nameMatchPAN && nameMatchGST;

  return {
    businessType: 'private_limited_company',
    kybStatus: kybPassed ? 'VERIFIED' : 'FAILED',
    details: results,
  };
};

/**
 * 5. Public Limited Company
 *    Required: CIN + PAN + GSTIN
 */
const verifyPublicLimited = async ({ cin, pan, gstin }) => {
  const results = {};

  const [cinData, panData, gstData] = await Promise.all([
    verifyCIN(cin),
    verifyPAN(pan),
    verifyGST(gstin),
  ]);

  results.cin = {
    verified: true,
    companyName: cinData.companyName || cinData.company_name,
    status: cinData.companyStatus || cinData.status,
    cin: cinData.cin,
  };

  results.pan = {
    verified: true,
    type: panData.type || panData.pan_type,
    name: panData.name || panData.full_name,
    status: panData.status,
  };

  results.gst = {
    verified: true,
    legalName: gstData.lgnm || gstData.legal_name,
    tradeName: gstData.tradeNam || gstData.trade_name,
    status: gstData.sts || gstData.status,
    gstin: gstData.gstin,
  };

  const panInGST = extractPANFromGSTIN(gstin);
  const panMatch = panInGST === pan.toUpperCase();

  const companyName = results.cin.companyName;

  const nameMatchPAN = namesMatch(companyName, panData, 'name', 'full_name');
  const nameMatchGST = namesMatch(
    companyName,
    gstData,
    'lgnm',
    'legal_name',
    'tradeNam',
    'trade_name'
  );

  results.crossChecks = {
    panEmbeddedInGSTIN: panMatch,
    companyNameMatchPAN: nameMatchPAN,
    companyNameMatchGST: nameMatchGST,
  };

  const kybPassed = panMatch && nameMatchPAN && nameMatchGST;

  return {
    businessType: 'public_limited_company',
    kybStatus: kybPassed ? 'VERIFIED' : 'FAILED',
    details: results,
  };
};

/**
 * 6. One Person Company (OPC)
 *    Required: CIN + PAN + GSTIN
 */
const verifyOPC = async ({ cin, pan, gstin }) => {
  const results = {};

  const [cinData, panData, gstData] = await Promise.all([
    verifyCIN(cin),
    verifyPAN(pan),
    verifyGST(gstin),
  ]);

  results.cin = {
    verified: true,
    companyName: cinData.companyName || cinData.company_name,
    status: cinData.companyStatus || cinData.status,
    cin: cinData.cin,
  };

  results.pan = {
    verified: true,
    type: panData.type || panData.pan_type,
    name: panData.name || panData.full_name,
    status: panData.status,
  };

  results.gst = {
    verified: true,
    legalName: gstData.lgnm || gstData.legal_name,
    tradeName: gstData.tradeNam || gstData.trade_name,
    status: gstData.sts || gstData.status,
    gstin: gstData.gstin,
  };

  const panInGST = extractPANFromGSTIN(gstin);
  const panMatch = panInGST === pan.toUpperCase();

  const companyName = results.cin.companyName;

  const nameMatchPAN = namesMatch(companyName, panData, 'name', 'full_name');
  const nameMatchGST = namesMatch(
    companyName,
    gstData,
    'lgnm',
    'legal_name',
    'tradeNam',
    'trade_name'
  );

  results.crossChecks = {
    panEmbeddedInGSTIN: panMatch,
    companyNameMatchPAN: nameMatchPAN,
    companyNameMatchGST: nameMatchGST,
  };

  const kybPassed = panMatch && nameMatchPAN && nameMatchGST;

  return {
    businessType: 'opc',
    kybStatus: kybPassed ? 'VERIFIED' : 'FAILED',
    details: results,
  };
};

// ---------------------------------------------------------------------------
// Dispatcher – routes to the correct flow based on businessType
// ---------------------------------------------------------------------------

const BUSINESS_TYPE_MAP = {
  sole_proprietorship: verifySoleProprietorship,
  partnership_firm: verifyPartnershipFirm,
  llp: verifyLLP,
  private_limited_company: verifyPrivateLimited,
  public_limited_company: verifyPublicLimited,
  opc: verifyOPC,
};

/**
 * Main entry point.
 * @param {object} payload - Validated request body
 */
const runKYBVerification = async (payload) => {
  const { businessType } = payload;

  const verifyFn = BUSINESS_TYPE_MAP[businessType];

  if (!verifyFn) {
    const err = new Error(`Unsupported businessType: ${businessType}`);
    err.statusCode = 400;
    throw err;
  }

  return verifyFn(payload);
};

module.exports = { runKYBVerification };
