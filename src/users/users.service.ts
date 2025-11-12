import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/env.validation';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const user = new User();
    user.username = createUserDto.username;
    user.hash = await bcrypt.hash(
      createUserDto.password,
      this.configService.getOrThrow('BCRYPT_SALT_ROUNDS'),
    );
    await this.userRepository.save(user);
    return;
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
