import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { setupSwagger } from '../config/swagger.config';

/**
 * Скрипт для генерации swagger.json без запуска сервера
 */
async function generateSwagger(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.setGlobalPrefix('api');

  // Настройка Swagger (автоматически экспортирует swagger.json)
  setupSwagger(app);

  await app.close();
  console.log('✅ Swagger spec generated successfully');
  process.exit(0);
}

generateSwagger().catch((error) => {
  console.error('❌ Error generating Swagger spec:', error);
  process.exit(1);
});
