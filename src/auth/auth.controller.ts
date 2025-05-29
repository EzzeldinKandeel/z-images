import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Request as Req } from 'express';
import { User } from 'src/users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: Req) {
    // This is just to please Typescript.
    // If we reach this line, there IS a user on req.
    if (!req.user) return;
    return this.authService.login(req.user as User);
  }
}
