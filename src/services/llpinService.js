const { getAuthToken } = require('./authService');
const axios = require('axios');

const verifyLLPIN = async (llpin) => {
  try {
    const token = await getAuthToken();

    const requestBody = {
      search: llpin,     // <-- use search instead of llpin
      consent: 'Y',
      reason: 'KYB Verification'
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': process.env.SANDBOX_API_KEY,
      'x-api-version': '2.0',
      'authorization': token
    };

    console.log("URL:", "https://test-api.sandbox.co.in/mca/company/master-data/search");
    console.log("Headers:", headers);
    console.log("Body:", requestBody);

    const response = await axios.post(
      'https://test-api.sandbox.co.in/mca/company/master-data/search',
      requestBody,
      { headers }
    );

    console.log("Sandbox Response:", response.data);

    return response.data.data;

  } catch (error) {
    console.error("Sandbox Error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { verifyLLPIN };