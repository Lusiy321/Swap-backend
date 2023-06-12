"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const express = require("express");
async function start() {
    const PORT = process.env.PORT || 6000;
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(express()));
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Test task for Incode')
        .setDescription('REAST API Documentation (https://github.com/Lusiy321)')
        .setVersion('1.0.0')
        .addTag('lusiy321@gmail.com')
        .addBearerAuth({
        description: 'JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT'
    }, 'BearerAuthMethod').addServer(`http://localhost:${PORT}`)
        .addServer('https://final-project-yourpe-backend.onrender.com')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(PORT, () => console.log(`Server started on port = http://localhost:${PORT}`));
}
start();
//# sourceMappingURL=main.js.map