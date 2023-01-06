import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
    const port = process.env.PORT ?? 5000;
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new HttpExceptionFilter()); // used across the whole application, for every controller and every route handler
    await app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server started on port ${port}...`);
    });
}

bootstrap();
