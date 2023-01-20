import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT ?? 5000;

    app.useGlobalFilters(new AllExceptionsFilter());

    await app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server started on port ${port}...`);
    });
}

bootstrap();

export function findSmallestInt(arr: number[]): number {
    return Math.min(...arr);
}
