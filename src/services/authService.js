const axios = require('axios');

let cachedToken = null;
let tokenExpiry = null;

const getAuthToken = async () => {
  const now = Date.now();

  // Use cached token if valid
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await axios.post(
      `${process.env.SANDBOX_BASE_URL}/authenticate`,
      {},
      {
        headers: {
          'x-api-key': process.env.SANDBOX_API_KEY,
          'x-api-secret': process.env.SANDBOX_API_SECRET,
          'x-api-version': '2.0',
          'Content-Type': 'application/json'
        }
      }
    );

    // DEBUG
    console.log("AUTH RESPONSE:", response.data);

    // FIX HERE
    cachedToken = response.data.access_token;

    console.log("TOKEN:", cachedToken);

    tokenExpiry = now + 55 * 60 * 1000;

    return cachedToken;

  } catch (error) {
    console.error("AUTH ERROR:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { getAuthToken };