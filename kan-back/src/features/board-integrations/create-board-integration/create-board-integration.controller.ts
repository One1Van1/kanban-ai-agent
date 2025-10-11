import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBoardIntegrationService } from './create-board-integration.service';
import { CreateBoardIntegrationRequestDto } from './create-board-integration.request.dto';
import { CreateBoardIntegrationResponseDto } from './create-board-integration.response.dto';

@ApiTags('Board Integrations')
@Controller('board-integrations')
export class CreateBoardIntegrationController {
  constructor(
    private readonly createBoardIntegrationService: CreateBoardIntegrationService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create board integration',
    description:
      'Create a new integration between an agent and an external board (Jira, Trello, etc.)',
  })
  @ApiResponse({
    status: 201,
    description: 'Board integration created successfully',
    type: CreateBoardIntegrationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data or board configuration',
  })
  @ApiResponse({
    status: 404,
    description: 'Agent not found',
  })
  async createBoardIntegration(
    @Body() dto: CreateBoardIntegrationRequestDto,
  ): Promise<CreateBoardIntegrationResponseDto> {
    return await this.createBoardIntegrationService.execute(dto);
  }
}
