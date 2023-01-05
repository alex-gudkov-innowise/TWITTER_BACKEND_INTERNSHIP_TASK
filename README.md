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