"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('claude', () => ({
    apiKey: process.env.CLAUDE_API_KEY || '',
    model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
    maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '1000', 10),
    temperature: parseFloat(process.env.CLAUDE_TEMPERATURE || '0.7'),
}));
//# sourceMappingURL=claude.config.js.map