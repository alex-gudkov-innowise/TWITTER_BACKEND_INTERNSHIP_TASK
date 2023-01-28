import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithUserRoles } from 'src/interfaces/request-with-user-roles.interface';

export const CurrentUserRolesDecorator = createParamDecorator(
    (data: unknown, context: ExecutionContext): string[] | undefined => {
        const requestWithUserRoles = context.switchToHttp().getRequest<RequestWithUserRoles>();

        return requestWithUserRoles.currentUserRoles;
    },
);
