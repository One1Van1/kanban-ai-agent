"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveTaskService = void 0;
const common_1 = require("@nestjs/common");
const jira_base_service_1 = require("../../../shared/jira/jira-base.service");
const move_task_response_dto_1 = require("./move-task.response.dto");
let MoveTaskService = class MoveTaskService extends jira_base_service_1.JiraBaseService {
    async execute(taskKey, requestDto) {
        try {
            const currentTask = await this.getTask(taskKey);
            const previousStatus = currentTask.fields.status.name;
            const transitionsResponse = await this.getTaskTransitions(taskKey);
            const targetTransition = transitionsResponse.transitions.find((t) => t.to.name.toLowerCase() === requestDto.targetColumn.toLowerCase());
            if (!targetTransition) {
                throw new Error(`Transition to "${requestDto.targetColumn}" not available`);
            }
            await this.transitionTask(taskKey, targetTransition.id);
            this.logger.log(`✅ Task ${taskKey} moved from "${previousStatus}" to "${requestDto.targetColumn}"`);
            if (requestDto.comment) {
                await this.addComment(taskKey, { body: requestDto.comment });
            }
            return new move_task_response_dto_1.MoveTaskResponseDto(true, taskKey, previousStatus, requestDto.targetColumn, 'Task moved successfully');
        }
        catch (error) {
            return new move_task_response_dto_1.MoveTaskResponseDto(false, taskKey, 'Unknown', requestDto.targetColumn, 'Failed to move task', undefined, error.message);
        }
    }
};
exports.MoveTaskService = MoveTaskService;
exports.MoveTaskService = MoveTaskService = __decorate([
    (0, common_1.Injectable)()
], MoveTaskService);
//# sourceMappingURL=move-task.service.js.map