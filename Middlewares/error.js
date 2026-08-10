import asyncHandler from 'express-async-handler';
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  let message    = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message    = Object.values(err.errors).map(e => e.message).join(', ');
  }
  if (err.name === 'CastError')    { statusCode = 400; message = `Invalid ${err.path}: ${err.value}`; }
  if (err.code === 11000)          { statusCode = 409; message = `${Object.keys(err.keyValue)[0]} already exists`; }
  if (err.code === 'LIMIT_FILE_SIZE') { statusCode = 413; message = `File too large. Max ${process.env.MAX_FILE_SIZE_MB || 10}MB`; }

  if (process.env.NODE_ENV !== 'production') console.error('[ERROR]', err);

  res.status(statusCode).json({
    success: false, message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

