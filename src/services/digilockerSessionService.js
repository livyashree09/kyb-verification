const axios = require('axios');
const { getAuthToken } = require('./authService');

const BASE_URL = "https://test-api.sandbox.co.in/kyc/digilocker";

const getHeaders = async () => {
  const token = await getAuthToken();

  return {
    "Content-Type": "application/json",
    "Authorization": token,
    "x-api-key": process.env.SANDBOX_API_KEY,
  };
};

/**
 * VERIFY USER
 */
const verifyUser = async (mobile) => {
  try {
    if (!mobile) throw new Error("mobile is required");

    const headers = await getHeaders();

    const body = {
      "@entity": "in.co.sandbox.kyc.digilocker.user.verification.request",
      mobile
    };

    const response = await axios.post(
      `${BASE_URL}/user/verify`,
      body,
      { headers }
    );

    return response.data?.data;

  } catch (error) {
    console.error(
      "verifyUser error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * INITIATE SESSION
 */
const initiateSession = async (requestData) => {
  try {
    if (!requestData?.mobile) throw new Error("mobile is required");

    if (!requestData?.redirect_url && !requestData?.redirectUrl) {
      throw new Error("redirect_url is required");
    }

    const headers = await getHeaders();

    const body = {
      "@entity": "in.co.sandbox.kyc.digilocker.session.request",
      flow: requestData.flow || "signin",
      redirect_url: requestData.redirect_url || requestData.redirectUrl,
      doc_types: requestData.doc_types || ["aadhaar"],
      options: {
        verification_method: ["aadhaar"],
        pinless: true,
        usernameless: true,
        verified_mobile: requestData.mobile
      }
    };

    console.log("FINAL BODY:", JSON.stringify(body, null, 2));

    const response = await axios.post(
      `${BASE_URL}/sessions/init`,
      body,
      { headers }
    );

    return response.data?.data;

  } catch (error) {
    console.error(
      "initiateSession error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * SESSION STATUS
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
    console.error(
      "getSessionStatus error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * USER PROFILE
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
    console.error(
      "getUserProfile error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * FETCH DOCUMENTS
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
    console.error(
      "fetchDocuments error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = {
  verifyUser,
  initiateSession,
  getSessionStatus,
  getUserProfile,
  fetchDocuments
};