import 'reflect-metadata';
import { AuthService } from '../services/auth.service';
import { container } from 'tsyringe';
import { ITokenCookie } from '../auth.interface';
import { RegisterUserDto } from '../dto/register-user.dto';
// import { ConflictException } from '@common/exceptions';
import { mocked } from 'ts-jest/utils';
import { ConflictException } from '@common/exceptions';

const registerDto: RegisterUserDto = {
  email: 'user1@gmail.com',
  name: 'user1',
  password: 'anotherworld',
};
const oneUser = {
  id: 'an id',
  email: 'user1@gmail.com',
  name: 'user1',
  password: 'anotherworld',
};

const mockAuthRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

jest.mock('typeorm');

describe('AuthService', () => {
  let authService: AuthService;
  let authRepo;

  beforeEach(async () => {
    authService = container.resolve(AuthService);
    authRepo = mocked(mockAuthRepository);
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
      authRepo.findOne.mockResolvedValue(oneUser);
      try {
        await authService.registerUser(registerDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
    it('Should not throw error when create new user', async () => {
      authRepo.findOne.mockResolvedValue(null);
      authRepo.create.mockReturnValue(oneUser);
      authRepo.save.mockResolvedValue(oneUser);

      const result = await authService.registerUser(registerDto);
      expect(result).toEqual(oneUser);
    });
  });
});
