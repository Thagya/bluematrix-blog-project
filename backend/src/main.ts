import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService = app.get(ConfigService);
 
  const baseUrl = configService.get('BASE_URL') || 'https://bluematrix-blog-project.onrender.com/';
  
// Serve static files from uploads directory
const uploadsPath = join(process.cwd(), 'uploads/images');
app.use('/uploads', express.static(uploadsPath));

Logger.log(`📁 Serving static files from: ${uploadsPath}`, 'StaticFiles');
Logger.log(`🖼️  Images accessible at: ${baseUrl}/uploads/`, 'StaticFiles');
  // CORS for local dev 
  app.enableCors({
    origin:  'https://bluematrix-blog-project.vercel.app',
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Bluematrix Blog API')
    .setDescription('API for blog & CMS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('PORT') || 5000;
  await app.listen(port);
  Logger.log(`Server running at ${baseUrl} (port ${port})`);
}
bootstrap();
