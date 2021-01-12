import { HttpException } from './HttpException';

export class ServerException extends HttpException {
  constructor() {
    super(500, 'Something went wrong!');
  }
}
