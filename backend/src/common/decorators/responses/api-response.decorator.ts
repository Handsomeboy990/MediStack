import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiErrorResponses } from './api-error-response.decorator';

/**
 * Standard success response for a single item, matching the { data, meta }
 * envelope produced by ResponseInterceptor.
 * @param model The model type used in the response data schema.
 */
export const ApiResponseSchema = <TModel extends Type<unknown>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: 'Request successful',
      schema: {
        type: 'object',
        properties: {
          data: { $ref: getSchemaPath(model) },
          meta: { type: 'object', nullable: true, example: null },
        },
      },
    }),
    ApiErrorResponses(),
  );
};

/**
 * Standard success response for a paginated list, matching the { data, meta }
 * envelope where meta carries the PaginationMeta fields.
 * @param model The model type used for the list items schema.
 */
export const ApiResponseListSchema = <TModel extends Type<unknown>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: 'Request successful',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 20 },
              total: { type: 'number', example: 200 },
              totalPages: { type: 'number', example: 10 },
            },
          },
        },
      },
    }),
    ApiErrorResponses(),
  );
};
