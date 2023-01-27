import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';

import { JwtPayloadWithUserId } from 'src/interfaces/jwt-payload-with-user-id.interface';
import { JwtPayloadWithUserRole } from 'src/interfaces/jwt-payload-with-user-role.interface';
import { RequestWithUserRole } from 'src/interfaces/request-with-user-role.interface';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

    public async use(request: RequestWithUser & RequestWithUserRole, response: Response, next: NextFunction) {
        try {
            // get token from authorization header
            const authorizationHeader = request.headers.authorization;

            if (!authorizationHeader) {
                throw new Error('empty authorization header');
            }

            const [tokenType, tokenValue] = authorizationHeader.split(' ');

            if (tokenType !== 'Bearer' || !tokenValue) {
                throw new Error('bearer token error');
            }

            const payload = this.jwtService.verify<JwtPayloadWithUserId & JwtPayloadWithUserRole>(tokenValue);

            console.log(payload);

            const currentUser = await this.usersService.getUserById(payload.userId);
            const currentUserRole = payload.userRole;

            // put current user info inside request object for further using
            request.currentUser = currentUser;
            request.currentUserRole = currentUserRole;
        } catch (error) {
            request.currentUser = null;
            request.currentUserRole = null;
        }

        next();
    }
}
