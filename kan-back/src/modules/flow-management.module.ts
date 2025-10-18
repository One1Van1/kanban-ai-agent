import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flow } from '../entities/flow.entity';
import { Agent } from '../entities/agent.entity';
import { AgentInstruction } from '../entities/agent-instruction.entity';

// Controllers
import { CreateFlowController } from '../features/flow-management/create-flow/create-flow.controller';
import { GetFlowController } from '../features/flow-management/get-flow/get-flow.controller';
import { UpdateFlowController } from '../features/flow-management/update-flow/update-flow.controller';
import { DeleteFlowController } from '../features/flow-management/delete-flow/delete-flow.controller';
import { ListFlowsController } from '../features/flow-management/list-flows/list-flows.controller';
import { CloneFlowController } from '../features/flow-management/clone-flow/clone-flow.controller';
import { ExecuteFlowController } from '../features/flow-management/execute-flow/execute-flow.controller';
import { DeployToAgentController } from '../features/flow-management/deploy-to-agent/deploy-to-agent.controller';

// Services
import { CreateFlowService } from '../features/flow-management/create-flow/create-flow.service';
import { GetFlowService } from '../features/flow-management/get-flow/get-flow.service';
import { UpdateFlowService } from '../features/flow-management/update-flow/update-flow.service';
import { DeleteFlowService } from '../features/flow-management/delete-flow/delete-flow.service';
import { ListFlowsService } from '../features/flow-management/list-flows/list-flows.service';
import { CloneFlowService } from '../features/flow-management/clone-flow/clone-flow.service';
import { ExecuteFlowService } from '../features/flow-management/execute-flow/execute-flow.service';
import { DeployToAgentService } from '../features/flow-management/deploy-to-agent/deploy-to-agent.service';

// Import AI Agent services
import { CreateAgentService } from '../features/ai-agent/create-agent/create-agent.service';
import { ConfigureColumnInstructionsService } from '../features/ai-agent/configure-column-instructions/configure-column-instructions.service';

// Import Flow Conversion services
import { ConvertFlowToAgentService } from '../features/flow-conversion/convert-flow-to-agent.service';
import { FlowAnalyzerService } from '../features/flow-conversion/flow-analyzer.service';
import { BlockConverterService } from '../features/flow-conversion/block-converter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Flow, Agent, AgentInstruction])],
  controllers: [
    CreateFlowController,
    GetFlowController,
    UpdateFlowController,
    DeleteFlowController,
    ListFlowsController,
    CloneFlowController,
    ExecuteFlowController,
    DeployToAgentController,
  ],
  providers: [
    CreateFlowService,
    GetFlowService,
    UpdateFlowService,
    DeleteFlowService,
    ListFlowsService,
    CloneFlowService,
    ExecuteFlowService,
    DeployToAgentService,
    CreateAgentService,
    ConfigureColumnInstructionsService,
    // Flow Conversion services
    ConvertFlowToAgentService,
    FlowAnalyzerService,
    BlockConverterService,
  ],
  exports: [
    CreateFlowService,
    GetFlowService,
    UpdateFlowService,
    DeleteFlowService,
    ListFlowsService,
    CloneFlowService,
    ExecuteFlowService,
    DeployToAgentService,
  ],
})
export class FlowManagementModule {}
