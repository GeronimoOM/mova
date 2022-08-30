import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './AppModule';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            logger: console,
        },
    );
    app.enableCors();
    await app.listen(process.env.APP_PORT || 3000, '0.0.0.0');
}
bootstrap();
