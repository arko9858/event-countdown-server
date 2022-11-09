import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @IsNotEmpty()
  @MaxLength(15)
  display_name: string;
}
