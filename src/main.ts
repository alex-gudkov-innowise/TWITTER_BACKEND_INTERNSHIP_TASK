import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT ?? 5000;

    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server started on port ${port}...`);
    });
}

bootstrap();
