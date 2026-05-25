const axios = require('axios');
const { getAuthToken } = require('./authService');

const BASE_URL = "https://test-api.sandbox.co.in/kyc/digilocker";

/**
 * Common headers
 */
const getHeaders = async () => {
  const token = await getAuthToken();

  return {
    "Content-Type": "application/json",
    "Authorization": token, // if needed: `Bearer ${token}`
    "x-api-key": process.env.SANDBOX_API_KEY,
  };
};

/**
 * 1. INITIATE DIGILOCKER SESSION (MAIN FLOW)
 */
const initiateSession = async (data) => {
  try {
    const {
      mobile,
      flow = "signin",
      redirect_url,
      doc_types = ["aadhaar"],
    } = data;

    if (!mobile) throw new Error("mobile is required");
    if (!redirect_url) throw new Error("redirect_url is required");

    const headers = await getHeaders();

    const requestBody = {
  "@entity": "in.co.sandbox.kyc.digilocker.session.request",
  flow: flow,
  redirect_url: redirectUrl,     // MUST convert
  doc_types: docTypes,           // MUST convert
  options: {
    verification_method: options.verification_method || ["aadhaar"],
    pinless: options.pinless ?? true,
    usernameless: options.usernameless ?? true,
    verified_mobile: mobile,
  }
};

    console.log("INIT SESSION REQUEST:", JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      `${BASE_URL}/sessions/init`,
      requestBody,
      { headers }
    );

    return response.data?.data;
  } catch (error) {
    console.error("initiateSession error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 2. SESSION STATUS
 */
const getSessionStatus = async (sessionId) => {
  try {
    if (!sessionId) throw new Error("sessionId is required");

    const headers = await getHeaders();

    const response = await axios.get(
      `${BASE_URL}/sessions/${sessionId}/status`,
      { headers }
    );

    return response.data?.data;
  } catch (error) {
    console.error("getSessionStatus error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 3. USER PROFILE
 */
const getUserProfile = async (sessionId) => {
  try {
    if (!sessionId) throw new Error("sessionId is required");

    const headers = await getHeaders();

    const response = await axios.get(
      `${BASE_URL}/sessions/${sessionId}/user/profile`,
      { headers }
    );

    return response.data?.data;
  } catch (error) {
    console.error("getUserProfile error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 4. FETCH DOCUMENTS
 */
const fetchDocuments = async (sessionId, docType = "aadhaar") => {
  try {
    if (!sessionId) throw new Error("sessionId is required");

    const headers = await getHeaders();

    const response = await axios.get(
      `${BASE_URL}/sessions/${sessionId}/documents/${docType}`,
      { headers }
    );

    return response.data?.data?.files || [];
  } catch (error) {
    console.error("fetchDocuments error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  initiateSession,
  getSessionStatus,
  getUserProfile,
  fetchDocuments,
};