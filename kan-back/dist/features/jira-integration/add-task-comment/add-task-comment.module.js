"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTaskCommentModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const add_task_comment_controller_1 = require("./add-task-comment.controller");
const add_task_comment_service_1 = require("./add-task-comment.service");
let AddTaskCommentModule = class AddTaskCommentModule {
};
exports.AddTaskCommentModule = AddTaskCommentModule;
exports.AddTaskCommentModule = AddTaskCommentModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [add_task_comment_controller_1.AddTaskCommentController],
        providers: [add_task_comment_service_1.AddTaskCommentService],
        exports: [add_task_comment_service_1.AddTaskCommentService],
    })
], AddTaskCommentModule);
//# sourceMappingURL=add-task-comment.module.js.map