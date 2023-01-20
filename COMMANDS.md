# COMMANDS

Start application in development mode 
```
$ npm run start:dev
```

ESLint packages
```
$ npm install -d @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-prettier eslint-plugin-sort-destructure-keys eslint-plugin-typescript-sort-keys prettier --save-dev
```

Migrations commands
```
$ npm run typeorm migration:create -- ./migrations/<MigrationName>
$ npm run typeorm migration:generate -- -d ./typeorm-config.ts -p ./migrations/<MigrationName>
$ npm run typeorm migration:run -- -d ./typeorm-config.ts
$ npm run typeorm migration:revert -- -d ./typeorm-config.ts
```

PostgreSQL CLI in Docker
```
$ docker exec -i -t postgres sh
# psql -U postgres -h localhost
postgres=# \c twitter
twitter=# \dt
```

Redis CLI in Docker
```
$ docker exec -i -t redis sh
/data # redis-cli
127.0.0.1:6379> keys *
```

Built-in HTTP exceptions
```
BadRequestException - 400
UnauthorizedException - 401
NotFoundException - 404
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

Additional settings
```JSON
{
    "editor.formatOnPaste": false,
    "[javascript]": {
        "editor.formatOnSave": true
    },
    "[html]": {
        "editor.formatOnSave": false
    },
    "[json]": {
        "editor.formatOnSave": false
    },
    "eslint.probe": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact",
        "html"
    ],
    "eslint.alwaysShowStatus": true,
    "eslint.format.enable": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```