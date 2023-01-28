import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';

import { JwtPayloadWithUserId } from 'src/interfaces/jwt-payload-with-user-id.interface';
import { JwtPayloadWithUserRoles } from 'src/interfaces/jwt-payload-with-user-roles.interface';
import { RequestWithUserRoles } from 'src/interfaces/request-with-user-roles.interface';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

    public async use(request: RequestWithUser & RequestWithUserRoles, response: Response, next: NextFunction) {
        try {
            const authorizationHeader = request.headers.authorization;

            if (!authorizationHeader) {
                throw new Error('empty authorization header');
            }

            const [tokenType, tokenValue] = authorizationHeader.split(' ');

            if (tokenType !== 'Bearer' || !tokenValue) {
                throw new Error('bearer token error');
            }

            const payload = this.jwtService.verify<JwtPayloadWithUserId & JwtPayloadWithUserRoles>(tokenValue);
            const currentUser = await this.usersService.getUserById(payload.userId);
            const currentUserRoles = payload.userRoles;

            request.currentUser = currentUser;
            request.currentUserRoles = currentUserRoles;
        } catch (error) {
            request.currentUser = null;
            request.currentUserRoles = [];
        }

        next();
    }
}
