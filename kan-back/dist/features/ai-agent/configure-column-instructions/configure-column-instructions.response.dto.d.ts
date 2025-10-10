import { TriggerConditionType, TriggerOperator } from './configure-column-instructions.request.dto';
export declare class AgentTriggerConditionResponseDto {
    type: TriggerConditionType;
    value?: string;
    operator?: TriggerOperator;
    constructor(data: Partial<AgentTriggerConditionResponseDto>);
}
export declare class AgentColumnInstructionResponseDto {
    id: string;
    agentId: string;
    boardId: string;
    columnId: string;
    columnName: string;
    instructions: string;
    triggerConditions?: AgentTriggerConditionResponseDto[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(data: Partial<AgentColumnInstructionResponseDto>);
}
export declare class ConfigureColumnInstructionsResponseDto {
    columnInstruction: AgentColumnInstructionResponseDto;
    message: string;
    constructor(columnInstruction: AgentColumnInstructionResponseDto, message: string);
}
