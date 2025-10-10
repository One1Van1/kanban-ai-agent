"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckService = void 0;
const common_1 = require("@nestjs/common");
const jira_base_service_1 = require("../../../shared/jira/jira-base.service");
const health_check_response_dto_1 = require("./health-check.response.dto");
let HealthCheckService = class HealthCheckService extends jira_base_service_1.JiraBaseService {
    async execute() {
        try {
            const isConnected = await this.testConnection();
            if (isConnected) {
                return new health_check_response_dto_1.HealthCheckResponseDto('ok', this.getConfig().baseUrl, this.getConfig().projectKey, {
                    message: 'Jira connection is healthy',
                });
            }
            else {
                throw new Error('Connection test failed');
            }
        }
        catch (error) {
            this.logger.error('Jira health check failed', error.stack);
            return new health_check_response_dto_1.HealthCheckResponseDto('error', this.getConfig().baseUrl || 'unknown', this.getConfig().projectKey || 'unknown', {
                error: error.message,
            });
        }
    }
};
exports.HealthCheckService = HealthCheckService;
exports.HealthCheckService = HealthCheckService = __decorate([
    (0, common_1.Injectable)()
], HealthCheckService);
//# sourceMappingURL=health-check.service.js.map