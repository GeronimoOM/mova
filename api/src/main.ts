import fastifyMultipart from '@fastify/multipart';
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

  await app.register(fastifyMultipart);

  app.enableCors();

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
