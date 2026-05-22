const { getAuthToken } = require('./authService');
const axios = require('axios');

const verifyGST = async (gstin) => {
  try {
    const token = await getAuthToken();

    const requestBody = {
      gstin: gstin,
      consent: 'Y'
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': process.env.SANDBOX_API_KEY,
      'x-api-version': '2.0',
      'authorization': token
    };

    console.log("URL:", "https://api.sandbox.co.in/gst/compliance/public/gstin/search");
    console.log("Headers:", headers);
    console.log("Body:", requestBody);

    const response = await axios.post(
      'https://api.sandbox.co.in/gst/compliance/public/gstin/search',
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

module.exports = { verifyGST };