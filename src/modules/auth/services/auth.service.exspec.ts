import 'reflect-metadata';
import { AuthService } from './auth.service';
import { container } from 'tsyringe';
import * as typeorm from 'typeorm';
import { ITokenCookie } from '../auth.interface';
import { RegisterUserDto } from '../dto/register-user.dto';
import { ConflictException } from '@common/exceptions';

(typeorm as any).getRepository = jest.fn();

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    authService = container.resolve(AuthService);
  });

  describe('Create cookie method', () => {
    it('Should return a string', () => {
      const tokenData: ITokenCookie = {
        token: '',
        expiresIn: 1,
      };
      expect(typeof authService.createCookie(tokenData)).toEqual('string');
    });
  });

  describe('Register user method', () => {
    describe('if email already taken', () => {
      it('Should throw an error when email already taken', async () => {
        const user: RegisterUserDto = {
          email: 'user1@gmail.com',
          name: 'user1',
          password: 'anotherworld',
        };
        (typeorm as any).getRepository.mockReturnValue({
          findOne: () => Promise.resolve(user),
        });
        await expect(authService.registerUser(user)).rejects.toMatchObject(
          new ConflictException(
            `User with email: ${user.email} already exists`,
          ),
        );
      });
    });
    describe('If email not taken', () => {
      it('Should not throw error when create new user', async () => {
        const user2: RegisterUserDto = {
          email: 'hana.will@gmail.com',
          name: 'Hana Will',
          password: 'anotherworld',
        };
        (typeorm as any).getRepository.mockReturnValue({
          findOne: () => Promise.resolve(undefined),
          create: () => ({
            ...user2,
            id: '1',
          }),
          save: () => Promise.resolve(),
        });

        await expect(authService.registerUser(user2)).resolves.toBeDefined();
      });
    });
  });
});
