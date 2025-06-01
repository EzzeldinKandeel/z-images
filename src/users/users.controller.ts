import {
  Controller,
  Get,
  Post,
  Body,
  //   Patch,
  Param,
  UseGuards,
  //   Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('/users/:username')
  // findOne(@Param('username') username: string) {
  //   return this.usersService.findOne(username);
  // }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
