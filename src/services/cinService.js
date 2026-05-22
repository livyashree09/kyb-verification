const { getAuthToken } = require('./authService');
const axios = require('axios');

/**
 * Verifies a CIN (Company Identification Number) via the Sandbox API.
 * Returns the full response data object on success.
 * @param {string} cin - CIN (e.g. "U12345TN2020PTC123456")
 */
const verifyCIN = async (cin) => {
  const token = await getAuthToken();

  const response = await axios.post(
    'https://test-api.sandbox.co.in/mca/company/master-data/search',
    {
      cin,
      consent: 'y',
      reason: 'KYB Verification',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.SANDBOX_API_KEY,
        'x-api-version': '2.0',
        'authorization': token,
      },
    }
  );

  return response.data.data;
};

module.exports = { verifyCIN };
