import { InvalidCredentialsException } from '@common/exceptions';
import { authMiddleware, validationMiddleware } from '@common/middleware';
import { User } from '@modules/users/user.entity';
import express, { Request, Response, NextFunction } from 'express';
import { container, injectable } from 'tsyringe';
import {
  IBodyWithTwoFactorAuthCode,
  IDataStoredInToken,
  IRequestUser,
  ITokenCookie,
  ITwoFactorAuthCode,
} from './auth.interface';
import { AuthService } from './services/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from './services/jwt.service';
import handler from 'express-async-handler';
import { TwoFactorAuthService } from './services/twoFactorAuth.service';
import { TwoFactorAuthDto } from './dto';

@injectable()
export class AuthController {
  public path = '/auth';
  public router = express.Router();
  private authService: AuthService;
  private jwtService: JwtService;
  private twoFactorAuthService: TwoFactorAuthService;

  constructor() {
    this.authService = container.resolve(AuthService);
    this.jwtService = container.resolve(JwtService);
    this.twoFactorAuthService = container.resolve(TwoFactorAuthService);
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
    this.router.post(`${this.path}/logout`, authMiddleware, this.logout);

    /* Two factor auth routes */
    // Generate auth code
    this.router.post(
      `${this.path}/2fa/generate`,
      authMiddleware,

      this.generateTwoFactorAuthCode,
    );

    this.router.post(
      `${this.path}/2fa/turn-on`,
      validationMiddleware(TwoFactorAuthDto),
      authMiddleware,
      this.turnOnTwoFactorAuth,
    );

    this.router.post(
      `${this.path}/2fa/authenticate`,
      validationMiddleware(TwoFactorAuthDto),
      authMiddleware(true),
      this.secondFactorAuth,
    );
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
        isSecondFactorAuth: false,
      };
      const tokenData: ITokenCookie = this.jwtService.sign(dataStorage);
      res.setHeader('Set-Cookie', [this.authService.createCookie(tokenData)]);
      res.send(tokenData);
    } catch (error) {
      next(error);
    }
  };
  private login = async (req: Request, res: Response, next: NextFunction) => {
    const loginDto = req.body as LoginUserDto;
    try {
      const user = (await this.authService.validateUser(loginDto)) as User;

      if (user) {
        const dataStorage: IDataStoredInToken = {
          userId: user.id,
          isSecondFactorAuth: false,
        };
        const tokenData: ITokenCookie = this.jwtService.sign(dataStorage);
        res.setHeader('Set-Cookie', [this.authService.createCookie(tokenData)]);
        if (user.isTwoFactorAuthEnabled) {
          res.send({
            isTwoFactorAuthEnabled: true,
          });
        } else {
          res.send(tokenData);
        }
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

  /* Two factor auth */
  private generateTwoFactorAuthCode = async (
    req: IRequestUser,
    res: Response,
  ) => {
    const user = req.user;
    const authCode: ITwoFactorAuthCode = this.twoFactorAuthService.getTwoFactorAuthCode();
    await this.twoFactorAuthService.updateUserWithTwoFactorAuth(
      user,
      authCode.base32,
    );
    this.twoFactorAuthService.respondWithQRCode(authCode.otpAuthUrl, res);
  };

  private turnOnTwoFactorAuth = async (
    req: IRequestUser,
    res: Response,
    next: NextFunction,
  ) => {
    const { twoFactorAuthCode } = req.body as IBodyWithTwoFactorAuthCode;
    const user = req.user;
    const isCodeValid = this.twoFactorAuthService.verifyTwoFactorAuthCode(
      twoFactorAuthCode,
      user,
    );
    if (isCodeValid) {
      await this.twoFactorAuthService.updateUserEnabledTwoFactorAuth(user);
      res.send(200);
    } else {
      next(new InvalidCredentialsException('Wrong auth token'));
    }
  };

  private secondFactorAuth = async (
    req: IRequestUser,
    res: Response,
    next: NextFunction,
  ) => {
    const { twoFactorAuthCode } = req.body as IBodyWithTwoFactorAuthCode;
    const user = req.user;
    const isCodeValid = await this.twoFactorAuthService.verifyTwoFactorAuthCode(
      twoFactorAuthCode,
      user,
    );
    if (isCodeValid) {
      const dataStorage: IDataStoredInToken = {
        userId: user.id,
        isSecondFactorAuth: true,
      };
      const tokenData = this.jwtService.sign(dataStorage);
      res.setHeader('Set-Cookie', [this.authService.createCookie(tokenData)]);
      const { password, twoFactorAuthCode, ...result } = user;
      res.send(result);
    } else {
      next(new InvalidCredentialsException('Wrong auth token'));
    }
  };
}
