import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateData } from './types/user.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(userCreateData: UserCreateData) {
    try {
      const { display_name, email, password } = userCreateData;

      const existingUserWithEmail = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUserWithEmail) {
        throw new BadRequestException('User with email aleady exists');
      }

      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password.trim(), saltOrRounds);

      const newUser = await this.prisma.user.create({
        data: { email, password: hash, display_name },
      });

      return newUser;
    } catch (err) {
      throw err;
    }
  }

  async findUserByCredentials(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user)
        throw new UnauthorizedException("User with email doesn't exist");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      return user;
    } catch (err) {
      throw err;
    }
  }
}
