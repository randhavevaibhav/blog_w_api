export const globalErrorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  
  console.log("Error ===> ", err);
  res.status(err.statusCode).send({
    message: err.message,
    status: err.status,
    variables:err.variables
  });
};
