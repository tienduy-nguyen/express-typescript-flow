import { User } from '@modules/users/user.entity';
import { Request } from 'express';

export interface IRequestUser extends Request {
  user?: User;
}
export interface IBodyWithTwoFactorAuthCode extends Request {
  twoFactorAuthCode?: string;
}

export interface IDataStoredInToken {
  userId: string;
  isSecondFactorAuth?: boolean;
}
export interface ITokenCookie {
  token: string;
  expiresIn: string | number;
}

export interface ITwoFactorAuthCode {
  otpAuthUrl: string;
  base32: string;
}
