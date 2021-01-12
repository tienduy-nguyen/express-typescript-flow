import { AuthService } from './auth.service';
import { getRepository, Repository } from 'typeorm';

describe('AuthService', () => {
  let authService;
  let userRepository;
  let mockUserRepository = () => ({
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  });
});
