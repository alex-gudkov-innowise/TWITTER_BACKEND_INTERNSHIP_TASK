import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface PrivacyInfo {
    ipAddress: string;
    userAgent: string;
}

export const PrivacyInfoDecorator = createParamDecorator(function (
    data: unknown,
    context: ExecutionContext,
): PrivacyInfo {
    const request = context.switchToHttp().getRequest<Request>();

    return {
        userAgent: request.get('user-agent'),
        ipAddress: request.socket.remoteAddress,
    };
});
