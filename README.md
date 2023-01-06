# TWITTER BACKEND INTERNSHIP TASK

Start application in development mode 
```
npm run start:dev
```

Migrations commands
```
npm run typeorm migration:create -- ./migrations/<MigrationName>
npm run typeorm migration:generate -- -d ./data-source.ts -p ./migrations/<MigrationName>
npm run build && npm run typeorm migration:run -- -d ./data-source.ts
npm run build && npm run typeorm migration:revert -- -d ./data-source.ts
```

```
psql -U postgres -h localhost
\c twitter_db_1;
\dt
\q
```

Built-in HTTP exceptions
```
BadRequestException
UnauthorizedException
NotFoundException
ForbiddenException
NotAcceptableException
RequestTimeoutException
ConflictException
GoneException
HttpVersionNotSupportedException
PayloadTooLargeException
UnsupportedMediaTypeException
UnprocessableEntityException
InternalServerErrorException
NotImplementedException
ImATeapotException
MethodNotAllowedException
BadGatewayException
ServiceUnavailableException
GatewayTimeoutException
PreconditionFailedExceptionBadRequestException
UnauthorizedException
NotFoundException
ForbiddenException
NotAcceptableException
RequestTimeoutException
ConflictException
GoneException
HttpVersionNotSupportedException
PayloadTooLargeException
UnsupportedMediaTypeException
UnprocessableEntityException
InternalServerErrorException
NotImplementedException
ImATeapotException
MethodNotAllowedException
BadGatewayException
ServiceUnavailableException
GatewayTimeoutException
PreconditionFailedExceptionBadRequestException
UnauthorizedException
NotFoundException
ForbiddenException
NotAcceptableException
RequestTimeoutException
ConflictException
GoneException
HttpVersionNotSupportedException
PayloadTooLargeException
UnsupportedMediaTypeException
UnprocessableEntityException
InternalServerErrorException
NotImplementedException
ImATeapotException
MethodNotAllowedException
BadGatewayException
ServiceUnavailableException
GatewayTimeoutException
PreconditionFailedException
```