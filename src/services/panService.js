const { getAuthToken } = require('./authService');
const { createAxiosInstance } = require('../config/axiosConfig');

const verifyPAN = async (pan) => {
  try {
    const token = await getAuthToken();
    const axiosInstance = createAxiosInstance(token);

    const requestBody = {
      "@entity": "in.co.sandbox.kyc.pan_verification.request",
      pan: pan,
      name_as_per_pan: "John Ronald Doe",
      date_of_birth: "11/11/2001",
      consent: "Y",
      reason: "KYB Verification"
    };

    console.log("Request Body:", requestBody);

    const response = await axiosInstance.post(
      '/kyc/pan/verify',
      requestBody
    );

    console.log("Sandbox Response:", response.data);

    return response.data.data;

  } catch (error) {
    console.error("Sandbox Error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { verifyPAN };