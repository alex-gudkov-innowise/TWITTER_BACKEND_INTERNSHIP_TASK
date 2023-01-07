import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';

import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {}

    public async use(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
            // get token from authorization header
            const authHeader = request.headers.authorization;

            if (!authHeader) {
                throw new Error('empty authorization header');
            }

            const [tokenType, tokenValue] = authHeader.split(' ');

            if (tokenType !== 'Bearer' || !tokenValue) {
                throw new Error('bearer token error');
            }

            const payload = this.jwtService.verify(tokenValue, {
                secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            });
            const currentUser = await this.usersService.getUserById(payload.userId);

            // put current user into request object for further using
            request.currentUser = currentUser;
        } catch (error) {
            request.currentUser = null;
        }

        next();
    }
}
