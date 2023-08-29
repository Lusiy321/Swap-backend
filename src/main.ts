/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as http from 'http';
import * as express from 'express';
import * as session from 'express-session';

async function start() {
  const PORT = process.env.PORT || 6000;
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(express()),
  );

  app.use(
    session({
      secret: process.env.GOOGLE_CLIENT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app.get(http.Server)));
  const config = new DocumentBuilder()
    .setTitle('Test server Swep')
    .setDescription('REAST API Documentation')
    .setVersion('1.0.0')
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
    .addServer(`https://swap-server.cyclic.cloud`)
    .addServer(`https://test-server-thing.onrender.com/`)
    .addServer(`http://localhost:${PORT}`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(PORT, () =>
    console.log(`Server started on port = http://localhost:${PORT}`),
  );
}
start();
