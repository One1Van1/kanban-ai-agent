import {
  Controller,
  Delete,
  Param,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteFlowService } from './delete-flow.service';
import { DeleteFlowResponseDto } from './delete-flow.response.dto';
import { ApiDeleteFlow } from './openapi.decorator';

@Controller('flow-management')
@ApiTags('DeleteFlow')
export class DeleteFlowController {
  private readonly logger = new Logger(DeleteFlowController.name);

  constructor(private readonly deleteFlowService: DeleteFlowService) {}

  @Delete(':id')
  @ApiDeleteFlow()
  async handle(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteFlowResponseDto> {
    this.logger.log(`DELETE /flow-management/${id} - Deleting flow`);

    const result = await this.deleteFlowService.execute(id);

    this.logger.log(`Flow deleted successfully: ${id}`);
    return result;
  }
}
