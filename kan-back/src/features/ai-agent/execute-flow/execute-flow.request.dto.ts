import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export interface FlowNodeData {
  type: string;
  name: string;
  config: any;
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: FlowNodeData;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface FlowDefinition {
  id: string;
  name: string;
  description?: string;
  version: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  variables: any[];
  settings: any;
}

export class ExecuteFlowRequestDto {
  @ApiProperty({
    description: 'Flow definition to execute',
    example: {
      id: 'flow-123',
      name: 'Hair Analysis Flow',
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          data: {
            type: 'jira_move',
            config: { column: 'На проверку' },
          },
        },
      ],
      edges: [],
    },
  })
  @IsNotEmpty()
  @IsObject()
  flowDefinition: FlowDefinition;

  @ApiProperty({
    description: 'Jira task key that triggered the flow',
    example: 'PROJ-123',
  })
  @IsNotEmpty()
  @IsString()
  taskKey: string;

  @ApiProperty({
    description: 'Trigger context data',
    example: {
      columnName: 'На проверку',
      triggerType: 'column_change',
      taskData: {},
    },
  })
  @IsNotEmpty()
  @IsObject()
  triggerContext: {
    columnName: string;
    triggerType: string;
    taskData: any;
  };
}
