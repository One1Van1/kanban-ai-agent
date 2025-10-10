"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteTaskTransitionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
const execute_task_transition_request_dto_1 = require("./execute-task-transition.request.dto");
let ExecuteTaskTransitionService = class ExecuteTaskTransitionService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async executeTransition(taskId, requestDto) {
        const currentTask = await this.taskHistoryRepository.findOne({
            where: { taskId },
            order: { createdAt: 'DESC' },
        });
        if (!currentTask) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        await this.validateTransition(currentTask, requestDto);
        const transitionMetadata = {
            fromStatus: currentTask.status,
            toStatus: requestDto.toStatus,
            fromColumn: currentTask.fromColumn,
            toColumn: requestDto.toColumn,
            action: requestDto.action,
            comment: requestDto.comment,
            resolution: requestDto.resolution,
            executedBy: requestDto.executedBy,
            executedAt: new Date(),
        };
        const historyLog = this.taskHistoryRepository.create({
            agentId: 'system',
            taskId,
            taskKey: currentTask.taskKey,
            taskTitle: currentTask.taskTitle,
            action: 'task_transition',
            fromStatus: currentTask.status,
            toStatus: requestDto.toStatus,
            fromColumn: currentTask.fromColumn,
            toColumn: requestDto.toColumn || currentTask.toColumn,
            status: 'completed',
            context: {
                ...transitionMetadata,
                transitionValidated: true,
                automatedTransition: false,
            },
            agentResponse: {
                success: true,
                transitionExecuted: requestDto.action,
                timestamp: new Date().toISOString(),
            },
        });
        const savedLog = await this.taskHistoryRepository.save(historyLog);
        return {
            taskId,
            action: requestDto.action,
            fromStatus: transitionMetadata.fromStatus,
            toStatus: transitionMetadata.toStatus,
            fromColumn: transitionMetadata.fromColumn,
            toColumn: transitionMetadata.toColumn,
            executedBy: requestDto.executedBy,
            executedAt: transitionMetadata.executedAt,
            comment: requestDto.comment,
            resolution: requestDto.resolution,
            success: true,
            historyLogId: savedLog.id,
        };
    }
    async validateTransition(currentTask, requestDto) {
        const { action, toStatus } = requestDto;
        const fromStatus = currentTask.status;
        const validTransitions = this.getValidTransitions();
        if (!validTransitions[action]) {
            throw new common_1.BadRequestException(`Invalid transition action: ${action}`);
        }
        const allowedFromStatuses = validTransitions[action].from;
        const allowedToStatuses = validTransitions[action].to;
        if (!allowedFromStatuses.includes(fromStatus)) {
            throw new common_1.BadRequestException(`Cannot execute ${action} from status ${fromStatus}. Allowed from: ${allowedFromStatuses.join(', ')}`);
        }
        if (!allowedToStatuses.includes(toStatus)) {
            throw new common_1.BadRequestException(`Cannot execute ${action} to status ${toStatus}. Allowed to: ${allowedToStatuses.join(', ')}`);
        }
        if (action === execute_task_transition_request_dto_1.TransitionAction.COMPLETE && !requestDto.resolution) {
            throw new common_1.BadRequestException('Resolution is required when completing a task');
        }
    }
    getValidTransitions() {
        return {
            [execute_task_transition_request_dto_1.TransitionAction.START_PROGRESS]: {
                from: ['todo', 'blocked'],
                to: ['in_progress'],
            },
            [execute_task_transition_request_dto_1.TransitionAction.SUBMIT_FOR_REVIEW]: {
                from: ['in_progress'],
                to: ['in_review'],
            },
            [execute_task_transition_request_dto_1.TransitionAction.APPROVE]: {
                from: ['in_review'],
                to: ['approved', 'done'],
            },
            [execute_task_transition_request_dto_1.TransitionAction.REQUEST_CHANGES]: {
                from: ['in_review'],
                to: ['in_progress', 'todo'],
            },
            [execute_task_transition_request_dto_1.TransitionAction.COMPLETE]: {
                from: ['approved', 'in_progress', 'in_review'],
                to: ['done', 'completed'],
            },
            [execute_task_transition_request_dto_1.TransitionAction.BLOCK]: {
                from: ['todo', 'in_progress', 'in_review'],
                to: ['blocked'],
            },
            [execute_task_transition_request_dto_1.TransitionAction.UNBLOCK]: {
                from: ['blocked'],
                to: ['todo', 'in_progress'],
            },
            [execute_task_transition_request_dto_1.TransitionAction.REOPEN]: {
                from: ['done', 'completed', 'closed'],
                to: ['todo', 'in_progress'],
            },
            [execute_task_transition_request_dto_1.TransitionAction.CLOSE]: {
                from: ['done', 'completed'],
                to: ['closed'],
            },
        };
    }
    async getAvailableTransitions(taskId) {
        const currentTask = await this.taskHistoryRepository.findOne({
            where: { taskId },
            order: { createdAt: 'DESC' },
        });
        if (!currentTask) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        const validTransitions = this.getValidTransitions();
        const availableActions = [];
        Object.entries(validTransitions).forEach(([action, transition]) => {
            if (transition.from.includes(currentTask.status)) {
                availableActions.push(action);
            }
        });
        return availableActions;
    }
};
exports.ExecuteTaskTransitionService = ExecuteTaskTransitionService;
exports.ExecuteTaskTransitionService = ExecuteTaskTransitionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExecuteTaskTransitionService);
//# sourceMappingURL=execute-task-transition.service.js.map