import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUserByCredentials(email, password);

    return { user_id: user.id, display_name: user.display_name };
  }

  // this function gets the user_id from validateUser function
  async login(user: { user_id: string; display_name: string }) {
    const payload = { sub: user.user_id, displayName: user.display_name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signupUser(signupDto: SignupDto) {
    try {
      const newUser = await this.usersService.createUser(signupDto);

      return `User '${newUser.display_name}' created successfully`;
    } catch (err) {
      throw err;
    }
  }
}
