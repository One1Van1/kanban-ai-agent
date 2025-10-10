import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiProduces,
} from '@nestjs/swagger';
import { DownloadAttachmentQueryDto } from './download-attachment.query.dto';

export const ApiDownloadAttachment = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Download an attachment file',
      description: `
        Downloads an attachment file by its ID. The file is streamed directly
        to the client with appropriate headers for download or inline display.
        
        The endpoint supports:
        - Force download vs inline display
        - Custom filename specification
        - Download activity logging for audit purposes
      `,
    }),
    ApiParam({
      name: 'attachmentId',
      description: 'UUID of the attachment to download',
      type: 'string',
      format: 'uuid',
      example: 'att-123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiQuery({
      name: 'forceDownload',
      description: 'Whether to force download instead of inline display',
      required: false,
      type: 'boolean',
      example: true,
    }),
    ApiQuery({
      name: 'filename',
      description: 'Custom filename for the download',
      required: false,
      type: 'string',
      example: 'my-custom-filename.pdf',
    }),
    ApiQuery({
      name: 'requestedBy',
      description: 'User requesting the download (for audit logging)',
      required: false,
      type: 'string',
      example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiProduces(
      'application/octet-stream',
      'application/pdf',
      'image/*',
      'text/*',
    ),
    ApiResponse({
      status: 200,
      description: 'File successfully downloaded',
      content: {
        'application/octet-stream': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
        'application/pdf': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
        'image/*': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
        'text/*': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Attachment not found',
      example: {
        statusCode: 404,
        message:
          'Attachment with ID att-123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during file download',
      example: {
        statusCode: 500,
        message: 'File could not be read',
        error: 'Internal Server Error',
      },
    }),
  );
