"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTaskTransitionsService = void 0;
const common_1 = require("@nestjs/common");
const jira_base_service_1 = require("../../../shared/jira/jira-base.service");
const get_task_transitions_response_dto_1 = require("./get-task-transitions.response.dto");
let GetTaskTransitionsService = class GetTaskTransitionsService extends jira_base_service_1.JiraBaseService {
    async execute(requestDto) {
        try {
            const transitionsResponse = await this.getTaskTransitions(requestDto.taskKey);
            return new get_task_transitions_response_dto_1.GetTaskTransitionsResponseDto(requestDto.taskKey, transitionsResponse.transitions);
        }
        catch (error) {
            this.logger.error(`Failed to get transitions for task: ${requestDto.taskKey}`, error.stack);
            throw error;
        }
    }
};
exports.GetTaskTransitionsService = GetTaskTransitionsService;
exports.GetTaskTransitionsService = GetTaskTransitionsService = __decorate([
    (0, common_1.Injectable)()
], GetTaskTransitionsService);
//# sourceMappingURL=get-task-transitions.service.js.map