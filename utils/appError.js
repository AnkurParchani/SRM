class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.status = `${this.statusCode}`.startsWith(4) ? "fail" : "error";
  }
}

module.exports = AppError;
