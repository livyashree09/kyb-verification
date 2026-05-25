const axios = require('axios');
const { getAuthToken } = require('./authService');

const BASE_URL = "https://test-api.sandbox.co.in/kyc/digilocker";

const getHeaders = async () => {
  const token = await getAuthToken();

  return {
    "Content-Type": "application/json",
    "Authorization": token, // change to `Bearer ${token}` if needed
    "x-api-key": process.env.SANDBOX_API_KEY,
  };
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
      doc_types: requestData.doc_types || requestData.docTypes || ["aadhaar"],
      options: {
        verification_method: ["aadhaar"],
        pinless: true,
        usernameless: true,
        verified_mobile: requestData.mobile,
      }
    };

    const url = `${BASE_URL}/sessions/init`;

    const response = await axios.post(url, body, { headers });

    return response.data?.data;

  } catch (error) {
    console.error("initiateSession error:", error.response?.data || error.message);
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

    const url = `${BASE_URL}/sessions/${sessionId}/status`;

    const response = await axios.get(url, { headers });

    return response.data?.data;

  } catch (error) {
    console.error("getSessionStatus error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * USER PROFILE
 */
const getUserProfile = async (sessionId) => {
  try {
    const headers = await getHeaders();

    const url = `${BASE_URL}/sessions/${sessionId}/user/profile`;

    const response = await axios.get(url, { headers });

    return response.data?.data;

  } catch (error) {
    console.error("getUserProfile error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * FETCH DOCUMENTS
 */
const fetchDocuments = async (sessionId, docType) => {
  try {
    if (!sessionId || !docType) {
      throw new Error("sessionId and docType are required");
    }

    const headers = await getHeaders();

    const url = `${BASE_URL}/sessions/${sessionId}/documents/${docType}`;

    const response = await axios.get(url, { headers });

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
  fetchDocuments
};