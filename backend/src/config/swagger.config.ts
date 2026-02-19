import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Настройка и инициализация Swagger для приложения
 * @param app - Экземпляр NestJS приложения
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('RieltAr API')
    .setDescription('API для управления арендой недвижимости')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT токен',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Экспорт swagger.json в папку swagger/
  const swaggerPath = join(process.cwd(), '..', 'swagger', 'swagger.json');
  writeFileSync(swaggerPath, JSON.stringify(document, null, 2), 'utf-8');
  console.log(`📄 Swagger spec exported to: ${swaggerPath}`);
}
