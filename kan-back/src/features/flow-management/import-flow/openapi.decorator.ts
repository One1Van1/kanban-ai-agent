import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ImportFlowBodyDto } from './import-flow.body.dto';
import { ImportFlowResponseDto } from './import-flow.response.dto';

export const ApiImportFlow = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Import flow from JSON',
      description:
        'Imports a flow from exported JSON data. Can create a new flow or replace an existing one based on the import mode.',
    }),
    ApiBody({
      type: ImportFlowBodyDto,
      description: 'Flow data to import',
    }),
    ApiCreatedResponse({
      description: 'Flow imported successfully',
      type: ImportFlowResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid import data or unsupported version',
    }),
    ApiNotFoundResponse({
      description:
        'Flow to replace not found (when using REPLACE_EXISTING mode)',
    }),
  );
