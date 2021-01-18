import 'reflect-metadata';
import { AuthService } from '../services/auth.service';
import { container } from 'tsyringe';
import { ITokenCookie } from '../auth.interface';
import { RegisterUserDto } from '../dto/register-user.dto';
import { ConflictException } from '@common/exceptions';
import * as typeorm from 'typeorm';

const registerDto1: RegisterUserDto = {
  email: 'user1@gmail.com',
  name: 'user1',
  password: 'anotherworld',
};
const registerDto2: RegisterUserDto = {
  email: 'user2@gmail.com',
  name: 'user2',
  password: 'anotherworld',
};
const user1 = {
  id: 'an id',
  email: 'user1@gmail.com',
  name: 'user1',
  password: 'anotherworld',
};
const user2 = {
  id: 'an id',
  email: 'user2@gmail.com',
  name: 'user2',
  password: 'anotherworld',
};

(typeorm as any).getRepository = jest.fn();

// const mockAuthRepo = () => ({
//   findOne: jest.fn(), // return value will be set in the test
//   create: jest.fn(),
//   save: jest.fn(),
// });

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

  describe('registerUser', () => {
    it('Should throw an error when email already taken', async () => {
      (typeorm as any).getRepository.mockReturnValue({
        findOne: () => Promise.resolve(user1),
      });
      await expect(
        authService.registerUser(registerDto1),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('registerUser2', () => {
    it('Should create new user', async () => {
      (typeorm as any).getRepository.mockReturnValue({
        findOne: () => Promise.resolve(undefined),
        create: () => user2,
        save: () => Promise.resolve(),
      });

      await expect(authService.registerUser(registerDto2)).resolves.toEqual(
        user2,
      );
    });
  });
});
