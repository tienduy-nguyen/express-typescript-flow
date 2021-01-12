import { User } from '@modules/users/user.entity';
import { Request } from 'express';

export interface IRequestUser extends Request {
  user?: User;
}

export interface IDataStoredInToken {
  userId: string;
}
export interface ITokenCookie {
  token: string;
  expiresIn: string | number;
}
