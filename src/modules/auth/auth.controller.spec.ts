import request from 'supertest';
import * as typeorm from 'typeorm';
import { App } from 'src/app/app';
import { RegisterUserDto } from '@modules/auth/dto';
import { AuthController } from './auth.controller';
import * as dotenv from 'dotenv';

dotenv.config();

(typeorm as any).getRepository = jest.fn();

describe('The authController', () => {
  describe('POST /auth/register', () => {
    describe('if the email is not taken', () => {
      it('response should have the Set-Cookie header with the Authorization token', () => {
        const userData: RegisterUserDto = {
          name: 'John Smith',
          email: 'john@smith.com',
          password: 'strongPassword123',
        };
        (typeorm as any).getRepository.mockReturnValue({
          findOne: () => Promise.resolve(undefined),
          create: () => ({
            ...userData,
            id: 0,
          }),
          save: () => Promise.resolve(),
        });
        const authController = new AuthController();
        const app = new App();
        return request(app.getServer)
          .post(`${authController.path}/register`)
          .send(userData)
          .expect('Set-Cookie', /^Authorization=.+/);
      });
    });
  });
});
