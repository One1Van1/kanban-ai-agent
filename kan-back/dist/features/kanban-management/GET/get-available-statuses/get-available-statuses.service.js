"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAvailableStatusesService = void 0;
const common_1 = require("@nestjs/common");
let GetAvailableStatusesService = class GetAvailableStatusesService {
    async execute() {
        const statuses = [
            {
                id: 'todo',
                name: 'To Do',
                description: 'Tasks that are planned but not yet started',
                color: '#42526E',
                category: 'todo',
                order: 1,
                isInitial: true,
                isFinal: false,
            },
            {
                id: 'in_progress',
                name: 'In Progress',
                description: 'Tasks that are currently being worked on',
                color: '#0052CC',
                category: 'in_progress',
                order: 2,
                isInitial: false,
                isFinal: false,
            },
            {
                id: 'in_review',
                name: 'In Review',
                description: 'Tasks that are completed and awaiting review',
                color: '#FF8B00',
                category: 'review',
                order: 3,
                isInitial: false,
                isFinal: false,
            },
            {
                id: 'done',
                name: 'Done',
                description: 'Tasks that are completed and approved',
                color: '#36B37E',
                category: 'done',
                order: 4,
                isInitial: false,
                isFinal: true,
            },
            {
                id: 'blocked',
                name: 'Blocked',
                description: 'Tasks that are blocked by external dependencies',
                color: '#DE350B',
                category: 'blocked',
                order: 5,
                isInitial: false,
                isFinal: false,
            },
        ];
        const transitions = [
            { from: 'todo', to: 'in_progress', name: 'Start Work' },
            { from: 'todo', to: 'blocked', name: 'Block Task' },
            { from: 'in_progress', to: 'in_review', name: 'Submit for Review' },
            { from: 'in_progress', to: 'blocked', name: 'Block Task' },
            { from: 'in_progress', to: 'todo', name: 'Stop Work' },
            { from: 'in_review', to: 'done', name: 'Approve' },
            { from: 'in_review', to: 'in_progress', name: 'Request Changes' },
            { from: 'blocked', to: 'todo', name: 'Unblock' },
            { from: 'blocked', to: 'in_progress', name: 'Resume Work' },
            { from: 'done', to: 'in_progress', name: 'Reopen' },
        ];
        return {
            success: true,
            data: {
                statuses,
                transitions,
                defaultStatus: 'todo',
                totalStatuses: statuses.length,
            },
            message: 'Available statuses retrieved successfully',
        };
    }
};
exports.GetAvailableStatusesService = GetAvailableStatusesService;
exports.GetAvailableStatusesService = GetAvailableStatusesService = __decorate([
    (0, common_1.Injectable)()
], GetAvailableStatusesService);
//# sourceMappingURL=get-available-statuses.service.js.map