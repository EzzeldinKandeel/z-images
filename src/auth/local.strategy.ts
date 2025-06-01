import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User | null> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      // This terminates the request and sends a response
      // that lets the user know that they are NOT authorized
      // to access the requested data.
      throw new UnauthorizedException();
    }
    return user;
  }
}
