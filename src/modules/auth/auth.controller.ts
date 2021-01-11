import {
  BadRequestException,
  InvalidCredentialsException,
} from '@common/exceptions';
import { validationMiddleware } from '@common/middleware';
import { User } from '@modules/users/user.entity';
import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { IDataStoredInToken, ITokenCookie } from './auth.interface';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from './jwt.service';
import handler from 'express-async-handler';

export class AuthController {
  public path = '/auth';
  public router = express.Router();
  private authService: AuthService;
  private jwtService: JwtService;

  constructor() {
    this.authService = container.resolve(AuthService);
    this.jwtService = container.resolve(JwtService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(RegisterUserDto),
      handler(this.register),
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LoginUserDto),
      handler(this.login),
    );
    this.router.post(`${this.path}/logout`, this.logout);
  }

  /* Private methods for routes */
  private register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const registerDto = req.body as RegisterUserDto;
      const user = await this.authService.registerUser(registerDto);
      const dataStorage: IDataStoredInToken = {
        userId: user.id,
      };
      const tokenData: ITokenCookie = this.jwtService.sign(dataStorage);
      res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
      res.send(tokenData);
    } catch (error) {
      next(error);
    }
  };
  private login = async (req: Request, res: Response, next: NextFunction) => {
    const loginDto = req.body as LoginUserDto;
    try {
      const userResult = await this.authService.validateUser(loginDto);
      if (userResult) {
        const dataStorage: IDataStoredInToken = {
          userId: (userResult as User).id,
        };
        const tokenData: ITokenCookie = this.jwtService.sign(dataStorage);
        res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        res.send(tokenData);
        return;
      }
      next(new InvalidCredentialsException('Invalid credentials'));
    } catch (error) {
      next(error);
    }
  };

  private logout = (req: Request, res: Response) => {
    res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    res.send(200);
  };

  private createCookie(tokenData: ITokenCookie) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}
