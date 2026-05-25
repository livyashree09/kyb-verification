const { getAuthToken } = require('./authService');
const axios = require('axios');

const verifyGST = async (gstin) => {
  try {
    const token = await getAuthToken();

    const requestBody = {
      gstin: gstin
    };

    const headers = {
      "Content-Type": "application/json",
      "Authorization": token,
      "x-api-key": process.env.SANDBOX_API_KEY,
      "x-api-version": "2.0",
      "x-accept-cache": "true"
    };

    console.log("URL:", "https://test-api.sandbox.co.in/gst/compliance/public/gstin/verify");
    console.log("Headers:", headers);
    console.log("Body:", requestBody);

    const response = await axios.post(
      "https://test-api.sandbox.co.in/gst/compliance/public/gstin/verify",
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