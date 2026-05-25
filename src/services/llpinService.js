const { getAuthToken } = require('./authService');
const { createAxiosInstance } = require('../config/axiosConfig');

const verifyLLPIN = async (llpin) => {
  try {
    const token = await getAuthToken();
    const axiosInstance = createAxiosInstance(token);

    const requestBody = {
      "@entity": "in.co.sandbox.kyc.mca.master_data.request",
      id: llpin,
      consent: "y",
      reason: "For Company KYC"
    };

    console.log("LLPIN Request:", requestBody);

    const response = await axiosInstance.post(
      '/mca/company/master-data/search',   // FIXED
      requestBody
    );

    console.log("Sandbox Response:", response.data);

    return response.data.data;

  } catch (error) {
    console.error("Sandbox Error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { verifyLLPIN };