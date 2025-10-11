import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardIntegration } from '../../entities/board-integration.entity';
import { Agent } from '../../entities/agent.entity';
import { BoardIntegrationFactory } from '../../shared/board-integration.factory';

// Импорты сервисов интеграций
import { JiraBoardService } from '../jira-integration/services/jira-board.service';
// import { TrelloBoardService } from '../trello-integration/services/trello-board.service';
// import { LinearBoardService } from '../linear-integration/services/linear-board.service';

// Импорты контроллеров и сервисов для board integrations
import { BoardIntegrationsController } from './board-integrations.controller';
import { CreateBoardIntegrationController } from './create-board-integration/create-board-integration.controller';
import { CreateBoardIntegrationService } from './create-board-integration/create-board-integration.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoardIntegration, Agent])],
  controllers: [BoardIntegrationsController, CreateBoardIntegrationController],
  providers: [
    // Board Integration Factory
    BoardIntegrationFactory,

    // Specific Board Services
    JiraBoardService,
    // TrelloBoardService,
    // LinearBoardService,

    // Board Integration Services
    CreateBoardIntegrationService,
  ],
  exports: [BoardIntegrationFactory, CreateBoardIntegrationService],
})
export class BoardIntegrationsModule {}
