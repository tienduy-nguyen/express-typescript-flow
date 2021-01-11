import { Request, Response } from 'express';
import { HttpException } from '@common/exceptions';

export const errorMiddleware = (
  err: HttpException,
  req: Request,
  res: Response,
  _,
) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message || 'Something went wrong!',
    },
  });
};
