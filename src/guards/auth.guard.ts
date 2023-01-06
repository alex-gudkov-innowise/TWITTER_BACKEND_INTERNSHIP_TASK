import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

    // the endpoint can be reached if canActivate() returns true
    public canActivate(context: ExecutionContext): boolean {
        // get the request object from the context
        const request = context.switchToHttp().getRequest<any>();

        // get token from authorization header
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException({ message: 'empty authorization header' });
        }

        const [tokenType, tokenValue] = authHeader.split(' ');

        if (tokenType !== 'Bearer' || !tokenValue) {
            throw new UnauthorizedException({ message: 'bearer token error' });
        }

        // verify access token
        try {
            const payload = this.jwtService.verify(tokenValue, {
                secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            });

            request.currentUserId = payload.userId; // put user id into request object for further using
        } catch (error) {
            throw new UnauthorizedException({ message: 'user not authorized' });
        }

        return true;
    }
}
