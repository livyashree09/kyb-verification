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
      reason: "For onboarding customers"
    };

    console.log("Request Body:", JSON.stringify(requestBody, null, 2));
    console.log("Request Headers:", axiosInstance.defaults.headers);
    console.log("Request URL:", axiosInstance.defaults.baseURL + '/kyc/pan/verify');

    const response = await axiosInstance.post(
      '/kyc/pan/verify',
      requestBody
    );

    console.log("Sandbox Response:", response.data);

    return response.data.data;

  } catch (error) {
    console.error("Sandbox Error:", error.response?.data || error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

module.exports = { verifyPAN };