import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request as Req } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Req = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
