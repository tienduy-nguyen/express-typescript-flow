import {
  IDataStoredInToken,
  IRequestUser,
  ITokenCookie,
} from './auth.interface';
import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';
import { InvalidCredentialsException } from '@common/exceptions';

@injectable()
export class JwtService {
  public jwtSecret: string;
  public expireTime = 60 * 60 * 2; // 2 hour
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
  }
  public sign(dataStorage: IDataStoredInToken): ITokenCookie {
    const token = jwt.sign(dataStorage, this.jwtSecret, {
      expiresIn: this.expireTime,
    });
    return {
      token: token,
      expiresIn: this.expireTime,
    };
  }
  public verify(token: string): IDataStoredInToken {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return decoded as IDataStoredInToken;
    } catch (error) {
      throw new InvalidCredentialsException('Token invalid or missing');
    }
  }
}
