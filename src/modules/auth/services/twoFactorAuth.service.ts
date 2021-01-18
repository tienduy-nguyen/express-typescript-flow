import { injectable } from 'tsyringe';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { Response } from 'express';
import { ITwoFactorAuthCode } from '../auth.interface';
import { getRepository, Repository } from 'typeorm';
import { User } from '@modules/users/user.entity';

@injectable()
export class TwoFactorAuthService {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public getTwoFactorAuthCode(): ITwoFactorAuthCode {
    const secretCode = speakeasy.generateSecret({
      name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
    });
    const authCode: ITwoFactorAuthCode = {
      otpAuthUrl: secretCode.otpauth_url,
      base32: secretCode.base32,
    };
    return authCode;
  }
  public respondWithQRCode(data: string, response: Response): void {
    QRCode.toFileStream(response, data);
  }

  public async updateUserWithTwoFactorAuth(
    user: User,
    base32: string,
  ): Promise<void> {
    user.twoFactorAuthCode = base32;
    await this.ormRepository.save(user);
  }
  public async updateUserEnabledTwoFactorAuth(user: User): Promise<void> {
    user.isTwoFactorAuthEnabled = true;
    await this.ormRepository.save(user);
  }

  public verifyTwoFactorAuthCode(twoFactorCode: string, user: User): boolean {
    return speakeasy.totp.verify({
      secret: user.twoFactorAuthCode,
      encoding: 'base32',
      token: twoFactorCode,
    });
  }
}
