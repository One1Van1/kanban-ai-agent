"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanManagementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const task_history_entity_1 = require("../../entities/task-history.entity");
const get_task_details_controller_1 = require("./GET/get-task-details/get-task-details.controller");
const get_task_details_service_1 = require("./GET/get-task-details/get-task-details.service");
const get_tasks_by_column_controller_1 = require("./GET/get-tasks-by-column/get-tasks-by-column.controller");
const get_tasks_by_column_service_1 = require("./GET/get-tasks-by-column/get-tasks-by-column.service");
const get_board_structure_controller_1 = require("./GET/get-board-structure/get-board-structure.controller");
const get_board_structure_service_1 = require("./GET/get-board-structure/get-board-structure.service");
const create_task_controller_1 = require("./POST/create-task/create-task.controller");
const create_task_service_1 = require("./POST/create-task/create-task.service");
const assign_task_controller_1 = require("./POST/assign-task/assign-task.controller");
const assign_task_service_1 = require("./POST/assign-task/assign-task.service");
const add_task_comment_controller_1 = require("./POST/add-task-comment/add-task-comment.controller");
const add_task_comment_service_1 = require("./POST/add-task-comment/add-task-comment.service");
const move_task_to_column_controller_1 = require("./PATCH/move-task-to-column/move-task-to-column.controller");
const move_task_to_column_service_1 = require("./PATCH/move-task-to-column/move-task-to-column.service");
const change_task_status_controller_1 = require("./PATCH/change-task-status/change-task-status.controller");
const change_task_status_service_1 = require("./PATCH/change-task-status/change-task-status.service");
const update_task_controller_1 = require("./PATCH/update-task/update-task.controller");
const update_task_service_1 = require("./PATCH/update-task/update-task.service");
let KanbanManagementModule = class KanbanManagementModule {
};
exports.KanbanManagementModule = KanbanManagementModule;
exports.KanbanManagementModule = KanbanManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([task_history_entity_1.TaskHistory])],
        controllers: [
            get_task_details_controller_1.GetTaskDetailsController,
            get_tasks_by_column_controller_1.GetTasksByColumnController,
            get_board_structure_controller_1.GetBoardStructureController,
            create_task_controller_1.CreateTaskController,
            assign_task_controller_1.AssignTaskController,
            add_task_comment_controller_1.AddTaskCommentController,
            move_task_to_column_controller_1.MoveTaskToColumnController,
            change_task_status_controller_1.ChangeTaskStatusController,
            update_task_controller_1.UpdateTaskController,
        ],
        providers: [
            get_task_details_service_1.GetTaskDetailsService,
            get_tasks_by_column_service_1.GetTasksByColumnService,
            get_board_structure_service_1.GetBoardStructureService,
            create_task_service_1.CreateTaskService,
            assign_task_service_1.AssignTaskService,
            add_task_comment_service_1.AddTaskCommentService,
            move_task_to_column_service_1.MoveTaskToColumnService,
            change_task_status_service_1.ChangeTaskStatusService,
            update_task_service_1.UpdateTaskService,
        ],
        exports: [
            get_task_details_service_1.GetTaskDetailsService,
            get_tasks_by_column_service_1.GetTasksByColumnService,
            get_board_structure_service_1.GetBoardStructureService,
            create_task_service_1.CreateTaskService,
            assign_task_service_1.AssignTaskService,
            add_task_comment_service_1.AddTaskCommentService,
            move_task_to_column_service_1.MoveTaskToColumnService,
            change_task_status_service_1.ChangeTaskStatusService,
            update_task_service_1.UpdateTaskService,
        ],
    })
], KanbanManagementModule);
//# sourceMappingURL=kanban-management.module.js.map