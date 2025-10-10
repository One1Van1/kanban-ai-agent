import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UploadAttachmentResponseDto } from './upload-attachment.response.dto';

export const ApiUploadAttachment = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Upload attachment to task',
      description:
        'Uploads a file attachment to a specific task with validation and storage',
    }),
    ApiParam({
      name: 'id',
      description: 'Task ID',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiCreatedResponse({
      type: UploadAttachmentResponseDto,
      description: 'File uploaded successfully',
    }),
    ApiBadRequestResponse({
      description:
        'Invalid file format, size exceeded, or invalid file content',
    }),
  );
