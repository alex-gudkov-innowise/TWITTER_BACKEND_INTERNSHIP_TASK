import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithUserRole } from 'src/interfaces/request-with-user-role.interface';

export const CurrentUserRoleDecorator = createParamDecorator(
    (data: unknown, context: ExecutionContext): string | undefined | null => {
        const requestWithUserRole = context.switchToHttp().getRequest<RequestWithUserRole>();

        return requestWithUserRole.currentUserRole;
    },
);
