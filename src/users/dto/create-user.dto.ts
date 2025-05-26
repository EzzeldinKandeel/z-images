import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 25) // min, max
  username: string;
  @IsString()
  @Length(18, 25) // min, max
  password: string;
}
