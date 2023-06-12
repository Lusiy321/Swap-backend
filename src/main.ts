/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function start() {
  const PORT = process.env.PORT || 6000;
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(express()),
  );
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Test task for Incode')
    .setDescription('REAST API Documentation (https://github.com/Lusiy321)')
    .setVersion('1.0.0')
    .addTag('lusiy321@gmail.com')
    .addBearerAuth(
      {
        description: 'JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'BearerAuthMethod',
    )
    .addServer(`http://localhost:${PORT}`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(PORT, () =>
    console.log(`Server started on port = http://localhost:${PORT}`),
  );
}
start();
