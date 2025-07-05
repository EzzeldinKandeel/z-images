import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@CurrentUser() user: User) {
    // This is just to please Typescript.
    // If we reach this line, there WILL ALWAYS BE a user on req.
    if (!user) return;
    return this.authService.login(user);
  }
}
