"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTaskCommentService = void 0;
const common_1 = require("@nestjs/common");
const jira_base_service_1 = require("../../../shared/jira/jira-base.service");
let AddTaskCommentService = class AddTaskCommentService extends jira_base_service_1.JiraBaseService {
    async addCommentToTask(taskKey, comment) {
        try {
            const commentBody = {
                body: {
                    version: 1,
                    type: 'doc',
                    content: [
                        {
                            type: 'paragraph',
                            content: [
                                {
                                    type: 'text',
                                    text: comment,
                                },
                            ],
                        },
                    ],
                },
            };
            await this.addComment(taskKey, commentBody);
            this.logger.log(`Comment added to task ${taskKey}`);
            return {
                success: true,
                taskKey,
                message: 'Comment added successfully',
            };
        }
        catch (error) {
            this.logger.error(`Failed to add comment to task ${taskKey}:`, error.message);
            return {
                success: false,
                taskKey,
                message: 'Failed to add comment',
                error: error.message,
            };
        }
    }
};
exports.AddTaskCommentService = AddTaskCommentService;
exports.AddTaskCommentService = AddTaskCommentService = __decorate([
    (0, common_1.Injectable)()
], AddTaskCommentService);
//# sourceMappingURL=add-task-comment.service.js.map