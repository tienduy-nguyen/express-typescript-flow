import { injectable } from 'tsyringe';
import { getRepository, Repository } from 'typeorm';
import { User } from '@modules/users/user.entity';
import { BadRequestException, ConflictException } from '@common/exceptions';
import bcrypt from 'bcrypt';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { ITokenCookie } from '../auth.interface';

@injectable()
export class AuthService {
  private userRepository: Repository<User> = getRepository(User);
  constructor() {
    this.userRepository = getRepository(User);
  }
  public async validateUser(loginDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (user) {
      const isMatch = await bcrypt.compare(loginDto.password, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    throw new BadRequestException('Invalid credentials');
  }

  public async registerUser(userDto: RegisterUserDto): Promise<User> {
    const userCheck = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    console.log(userCheck);
    if (userCheck) {
      throw new ConflictException(
        `User with email: ${userDto.email} already exists`,
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userDto.password, salt);
    const user = await this.userRepository.create({
      ...userDto,
      password: hashPassword,
    });
    await this.userRepository.save(user);
    return user;
  }

  public async isExists(userInput: any) {
    const user = await this.userRepository.findOne({
      where: { email: userInput.email },
    });
    if (user) return true;
    return false;
  }

  public createCookie(tokenData: ITokenCookie) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}
