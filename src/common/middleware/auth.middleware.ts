import { InvalidCredentialsException } from '@common/exceptions';
import { IDataStoredInToken, IRequestUser } from '@modules/auth/auth.interface';
import { JwtService } from '@modules/auth/services/jwt.service';
import { User } from '@modules/users/user.entity';
import { Response, NextFunction, RequestHandler } from 'express';
import { container } from 'tsyringe';
import { getRepository } from 'typeorm';
import handler from 'express-async-handler';

export function authMiddleware(omitSecondFactor = false): RequestHandler {
  return handler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const cookies = req.cookies;
      if (cookies && cookies.Authorization) {
        try {
          const jwtService = container.resolve(JwtService);
          const userRepository = getRepository(User);
          const decoded = jwtService.verify(
            cookies.Authorization,
          ) as IDataStoredInToken;
          const { userId, isSecondFactorAuth } = decoded;
          const user = await userRepository.findOne({
            where: { id: userId },
          });
          if (user) {
            if (
              !omitSecondFactor &&
              user.isTwoFactorAuthEnabled &&
              !isSecondFactorAuth
            ) {
              next(new InvalidCredentialsException('Wrong auth token'));
            } else {
              req.user = user;
              next();
            }
            return;
          }
          next(new InvalidCredentialsException('Wrong authentication token!'));
        } catch (error) {
          next(error);
        }
      } else {
        next(new InvalidCredentialsException('Token invalid or missing'));
      }
    },
  );
}
