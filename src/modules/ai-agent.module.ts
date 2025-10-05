import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { aiAgentConfig } from '../config';

// Controllers
import { ConfigureAgentController } from '../features/ai-agent/configure-agent/configure-agent.controller';
import { ConfigureColumnInstructionsController } from '../features/ai-agent/configure-column-instructions/configure-column-instructions.controller';
import { CreateAgentController } from '../features/ai-agent/create-agent/create-agent.controller';
import { ExecuteAgentActionController } from '../features/ai-agent/execute-agent-action/execute-agent-action.controller';
import { GetAgentActivityController } from '../features/ai-agent/get-agent-activity/get-agent-activity.controller';
import { TrackAgentInTaskController } from '../features/ai-agent/track-agent-in-task/track-agent-in-task.controller';

// Services
import { ConfigureAgentService } from '../features/ai-agent/configure-agent/configure-agent.service';
import { ConfigureColumnInstructionsService } from '../features/ai-agent/configure-column-instructions/configure-column-instructions.service';
import { CreateAgentService } from '../features/ai-agent/create-agent/create-agent.service';
import { ExecuteAgentActionService } from '../features/ai-agent/execute-agent-action/execute-agent-action.service';
import { GetAgentActivityService } from '../features/ai-agent/get-agent-activity/get-agent-activity.service';
import { TrackAgentInTaskService } from '../features/ai-agent/track-agent-in-task/track-agent-in-task.service';

@Module({
  imports: [ConfigModule.forFeature(aiAgentConfig)],
  controllers: [
    ConfigureAgentController,
    ConfigureColumnInstructionsController,
    CreateAgentController,
    ExecuteAgentActionController,
    GetAgentActivityController,
    TrackAgentInTaskController,
  ],
  providers: [
    ConfigureAgentService,
    ConfigureColumnInstructionsService,
    CreateAgentService,
    ExecuteAgentActionService,
    GetAgentActivityService,
    TrackAgentInTaskService,
  ],
  exports: [
    ConfigureAgentService,
    ConfigureColumnInstructionsService,
    CreateAgentService,
    ExecuteAgentActionService,
    GetAgentActivityService,
    TrackAgentInTaskService,
  ],
})
export class AiAgentModule {}
