import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flow } from '../entities/flow.entity';
import { Agent } from '../entities/agent.entity';

// Controllers
import { CreateFlowController } from '../features/flow-management/create-flow/create-flow.controller';
import { GetFlowController } from '../features/flow-management/get-flow/get-flow.controller';
import { UpdateFlowController } from '../features/flow-management/update-flow/update-flow.controller';
import { DeleteFlowController } from '../features/flow-management/delete-flow/delete-flow.controller';
import { ListFlowsController } from '../features/flow-management/list-flows/list-flows.controller';
import { CloneFlowController } from '../features/flow-management/clone-flow/clone-flow.controller';
import { ExecuteFlowController } from '../features/flow-management/execute-flow/execute-flow.controller';

// Services
import { CreateFlowService } from '../features/flow-management/create-flow/create-flow.service';
import { GetFlowService } from '../features/flow-management/get-flow/get-flow.service';
import { UpdateFlowService } from '../features/flow-management/update-flow/update-flow.service';
import { DeleteFlowService } from '../features/flow-management/delete-flow/delete-flow.service';
import { ListFlowsService } from '../features/flow-management/list-flows/list-flows.service';
import { CloneFlowService } from '../features/flow-management/clone-flow/clone-flow.service';
import { ExecuteFlowService } from '../features/flow-management/execute-flow/execute-flow.service';

@Module({
  imports: [TypeOrmModule.forFeature([Flow, Agent])],
  controllers: [
    CreateFlowController,
    GetFlowController,
    UpdateFlowController,
    DeleteFlowController,
    ListFlowsController,
    CloneFlowController,
    ExecuteFlowController,
  ],
  providers: [
    CreateFlowService,
    GetFlowService,
    UpdateFlowService,
    DeleteFlowService,
    ListFlowsService,
    CloneFlowService,
    ExecuteFlowService,
  ],
  exports: [
    CreateFlowService,
    GetFlowService,
    UpdateFlowService,
    DeleteFlowService,
    ListFlowsService,
    CloneFlowService,
    ExecuteFlowService,
  ],
})
export class FlowManagementModule {}
