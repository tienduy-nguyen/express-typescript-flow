import { injectable } from 'tsyringe';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { Response } from 'express';

@injectable()
export class TwoFactorAuthService {
  public getTwoFactorAuthCode() {
    const secretCode = speakeasy.generateSecret({
      name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
    });
    return {
      otpauthUrl: secretCode.otpauth_url,
      base32: secretCode.base32,
    };
  }
  public respondWithQRCode(data: string, response: Response) {
    QRCode.toFileStream(response, data);
  }
}
