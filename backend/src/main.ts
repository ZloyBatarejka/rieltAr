import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3070',
    credentials: true,
  });

  const port = process.env.PORT ?? 8070;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/api`);
}
void bootstrap();
