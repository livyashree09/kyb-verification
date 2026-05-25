const { getAuthToken } = require('./authService');
const axios = require('axios');

const verifyCIN = async (cin) => {
  try {
    const token = await getAuthToken();

   const requestBody = {
  "@entity": "in.co.sandbox.kyc.mca.master_data.request",
  id: cin,
  consent: "y",
  reason: "For Company KYC"
};

    const headers = {
      "Content-Type": "application/json",
      "x-api-key": process.env.SANDBOX_API_KEY,
      "x-api-version": "2.0",
      "Authorization": token      // IMPORTANT
    };

    console.log("HEADERS:", JSON.stringify(headers, null, 2));
    console.log("BODY:", JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      "https://test-api.sandbox.co.in/mca/company/master-data/search",
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

module.exports = { verifyCIN };