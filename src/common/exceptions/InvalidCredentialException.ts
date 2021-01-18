import { HttpException } from './HttpException';

export class InvalidCredentialsException extends HttpException {
  constructor(message?: string) {
    message = message || 'Invalid credentials!';
    super(401, message);
  }
}
