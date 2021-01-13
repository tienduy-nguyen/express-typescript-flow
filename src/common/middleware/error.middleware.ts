import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@common/exceptions';

export const errorMiddleware = (
  err: HttpException,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(err.status || 500);
  res.send({
    errors: {
      message: err.message || 'Something went wrong!',
    },
  });
};
