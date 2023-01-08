import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { UsersEntity } from 'src/users/users.entity';

export const CurrentUser = createParamDecorator(function (data: unknown, context: ExecutionContext): UsersEntity {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    return request.currentUser;
});
