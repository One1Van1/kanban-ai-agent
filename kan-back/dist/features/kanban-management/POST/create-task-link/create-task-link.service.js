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
exports.CreateTaskLinkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let CreateTaskLinkService = class CreateTaskLinkService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(sourceTaskId, requestDto) {
        const { targetTaskId, linkType, description, createdBy } = requestDto;
        if (sourceTaskId === targetTaskId) {
            throw new Error('Task cannot link to itself');
        }
        const existingLink = await this.checkExistingLink(sourceTaskId, targetTaskId, linkType);
        if (existingLink) {
            throw new Error(`Link of type "${linkType}" already exists between these tasks`);
        }
        const linkEntry = this.taskHistoryRepository.create({
            taskId: sourceTaskId,
            taskKey: sourceTaskId,
            taskTitle: `Link created: ${sourceTaskId} ${linkType} ${targetTaskId}`,
            action: 'link_created',
            agentId: createdBy,
            status: 'completed',
            context: {
                sourceTaskId,
                targetTaskId,
                linkType,
                description,
                linkDirection: 'outbound',
            },
        });
        const savedEntry = await this.taskHistoryRepository.save(linkEntry);
        const reverseLinkType = this.getReverseLinkType(linkType);
        if (reverseLinkType) {
            const reverseLinkEntry = this.taskHistoryRepository.create({
                taskId: targetTaskId,
                taskKey: targetTaskId,
                taskTitle: `Link created: ${targetTaskId} ${reverseLinkType} ${sourceTaskId}`,
                action: 'link_created',
                agentId: createdBy,
                status: 'completed',
                context: {
                    sourceTaskId: targetTaskId,
                    targetTaskId: sourceTaskId,
                    linkType: reverseLinkType,
                    description,
                    linkDirection: 'inbound',
                    originalLinkId: savedEntry.id,
                },
            });
            await this.taskHistoryRepository.save(reverseLinkEntry);
        }
        const linkData = {
            id: savedEntry.id,
            sourceTaskId,
            targetTaskId,
            linkType,
            description,
            createdBy,
            createdAt: savedEntry.createdAt,
            isActive: true,
        };
        return {
            success: true,
            data: linkData,
            message: 'Task link created successfully',
        };
    }
    async checkExistingLink(sourceTaskId, targetTaskId, linkType) {
        const existingLink = await this.taskHistoryRepository.findOne({
            where: {
                taskId: sourceTaskId,
                action: 'link_created',
                context: {
                    targetTaskId,
                    linkType,
                },
            },
        });
        return !!existingLink;
    }
    getReverseLinkType(linkType) {
        const reverseMap = {
            blocks: 'blocked_by',
            blocked_by: 'blocks',
            depends_on: 'required_by',
            required_by: 'depends_on',
            duplicates: 'duplicates',
            clones: 'clones',
            relates_to: 'relates_to',
        };
        return reverseMap[linkType] || null;
    }
};
exports.CreateTaskLinkService = CreateTaskLinkService;
exports.CreateTaskLinkService = CreateTaskLinkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CreateTaskLinkService);
//# sourceMappingURL=create-task-link.service.js.map