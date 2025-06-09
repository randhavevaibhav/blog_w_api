export class AppError extends Error {
  constructor(message, statusCode,variables) {
    super(message,variables);
    this.statusCode = statusCode;
   this.variables = {...variables}
    this.status = `${statusCode}`.startsWith(`4`) ? "fail" : "error";
    this.isOperational = true;
    

    Error.captureStackTrace(this, this.constructor);
  }
}

