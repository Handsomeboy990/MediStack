import { ApiResponseOptions } from '@nestjs/swagger';

// Builds a Swagger schema matching the error envelope produced by
// HttpExceptionFilter: { error: { code, message, details } }.
const buildErrorSchema = (
  codeExample: string,
  messageExample: string,
): ApiResponseOptions => ({
  schema: {
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          code: { type: 'string', example: codeExample },
          message: { type: 'string', example: messageExample },
          details: { type: 'object', nullable: true, example: null },
        },
      },
    },
  },
});

export const badRequestErrorSchema = buildErrorSchema(
  'VALIDATION_ERROR',
  'Validation failed',
);
export const unauthorizedErrorSchema = buildErrorSchema(
  'UNAUTHENTICATED',
  'Invalid or expired token',
);
export const forbiddenErrorSchema = buildErrorSchema(
  'FORBIDDEN',
  'Insufficient permissions',
);
export const notFoundErrorSchema = buildErrorSchema(
  'NOT_FOUND',
  'Resource not found',
);
export const internalServerErrorSchema = buildErrorSchema(
  'INTERNAL_ERROR',
  'Internal server error',
);
