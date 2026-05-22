/**
 * Global error handler middleware.
 * Handles Axios API errors from Sandbox and generic server errors.
 */
const errorHandler = (err, req, res, next) => {
  // Axios error from Sandbox API
  if (err.response) {
    const { status, data } = err.response;
    return res.status(status || 502).json({
      success: false,
      message: 'Sandbox API error',
      sandboxError: data,
    });
  }

  // Network / timeout error
  if (err.request) {
    return res.status(503).json({
      success: false,
      message: 'Unable to reach Sandbox API. Please try again later.',
    });
  }

  // Custom application error with statusCode
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
