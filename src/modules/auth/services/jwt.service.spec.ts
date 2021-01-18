import 'reflect-metadata';
import { IDataStoredInToken } from '../auth.interface';
import { JwtService } from './jwt.service';
import * as dotenv from 'dotenv';
import { InvalidCredentialsException } from '@common/exceptions';

describe('JwtService', () => {
  let jwtService: JwtService;
  dotenv.config();
  beforeEach(async () => {
    jwtService = new JwtService();
  });

  describe('Jwt sign method', () => {
    it('Should be defined', () => {
      const dataStorage: IDataStoredInToken = { userId: '1' };
      expect(jwtService.sign(dataStorage)).toBeDefined();
    });
  });

  describe('Jwt verify method', () => {
    it('Should throw an error', () => {
      try {
        jwtService.verify('');
      } catch (error) {
        expect(error).toMatchObject(
          new InvalidCredentialsException('Token invalid or missing'),
        );
      }
    });
  });
});
