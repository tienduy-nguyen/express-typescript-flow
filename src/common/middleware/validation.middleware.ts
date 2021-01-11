import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpException } from '@common/exceptions';
import handler from 'express-async-handler';
import { ClassType } from 'class-transformer/ClassTransformer';
import { RequestHandler } from 'express';

export function validationMiddleware<T>(
  type: ClassType<T>,
  skipMissingProperties = false,
): RequestHandler {
  return handler(async (req, res, next) => {
    const parsedBody = plainToClass(type, req.body);
    const errors = await validate(parsedBody, { skipMissingProperties });
    if (errors.length !== 0) {
      const message = errors.join('').trimEnd();
      next(new HttpException(400, message));
    } else {
      req.body = parsedBody;
      next();
    }
  });
}
