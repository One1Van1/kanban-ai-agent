"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextPriority = exports.ContextSourceType = void 0;
var ContextSourceType;
(function (ContextSourceType) {
    ContextSourceType["TASK_DETAILS"] = "task_details";
    ContextSourceType["RELATED_TASKS"] = "related_tasks";
    ContextSourceType["TASK_COMMENTS"] = "task_comments";
    ContextSourceType["TASK_HISTORY"] = "task_history";
    ContextSourceType["EXTERNAL_API"] = "external_api";
    ContextSourceType["FILE_ATTACHMENTS"] = "file_attachments";
    ContextSourceType["USER_PROFILE"] = "user_profile";
    ContextSourceType["PROJECT_SETTINGS"] = "project_settings";
})(ContextSourceType || (exports.ContextSourceType = ContextSourceType = {}));
var ContextPriority;
(function (ContextPriority) {
    ContextPriority["LOW"] = "low";
    ContextPriority["MEDIUM"] = "medium";
    ContextPriority["HIGH"] = "high";
    ContextPriority["CRITICAL"] = "critical";
})(ContextPriority || (exports.ContextPriority = ContextPriority = {}));
//# sourceMappingURL=context.interface.js.map