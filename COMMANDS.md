# COMMANDS

Start application in development mode 
```
npm run start:dev
```

ESLint packages
```
npm i -d @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-prettier eslint-plugin-sort-destructure-keys eslint-plugin-typescript-sort-keys prettier --save-dev
```

Migrations commands
```
npm run build && npm run typeorm migration:create -- ./migrations/<MigrationName>
npm run build && npm run typeorm migration:generate -- -d ./data-source.ts -p ./migrations/<MigrationName>
npm run build && npm run typeorm migration:run -- -d ./data-source.ts
npm run build && npm run typeorm migration:revert -- -d ./data-source.ts
```

PostgreSQL CLI
```
psql -U postgres -h localhost
\c twitter_db_1;
\dt
\q
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

Additional settings.json
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