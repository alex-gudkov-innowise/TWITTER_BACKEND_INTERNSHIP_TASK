import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersEntity } from 'src/users/users.entity';

import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

export const CurrentUserDecorator = createParamDecorator(function (
    data: unknown,
    context: ExecutionContext,
): UsersEntity | null {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    return request.currentUser;
});
