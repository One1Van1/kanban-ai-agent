import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { GetAvailableStatusesResponseDto } from './get-available-statuses.response.dto';

export const ApiGetAvailableStatuses = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all available task statuses',
      description:
        'Retrieves all possible task statuses with transitions and metadata',
    }),
    ApiOkResponse({
      type: GetAvailableStatusesResponseDto,
      description: 'Available statuses retrieved successfully',
    }),
  );
