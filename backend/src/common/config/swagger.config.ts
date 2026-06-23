import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Mounts the OpenAPI documentation at /docs. The Bearer scheme lets the UI
// authenticate requests with the JWT returned by the login endpoint.
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('MediTrust API')
    .setDescription('Billing and stock management API for health centers.')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}
