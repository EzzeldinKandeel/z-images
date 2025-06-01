import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// This is just to make using the guard more robust,
// instead of relying on a magin word 'jwt'.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// This guard starts the authentication pipeline.
// The first step is calling (validate),
// which is defined in './jwt.strategy.ts'.
