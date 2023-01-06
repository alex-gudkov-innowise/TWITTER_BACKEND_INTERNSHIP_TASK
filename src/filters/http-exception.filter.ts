import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    public catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const statusCode = exception.getStatus();

        response.status(statusCode).json({
            statusCode,
            timestamp: Date.now(),
            path: request.url,
            message: exception.message,
        });
    }
}
