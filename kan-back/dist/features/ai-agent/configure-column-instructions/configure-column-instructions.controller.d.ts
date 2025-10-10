import { ConfigureColumnInstructionsService } from './configure-column-instructions.service';
import { ConfigureColumnInstructionsRequestDto } from './configure-column-instructions.request.dto';
import { ConfigureColumnInstructionsResponseDto } from './configure-column-instructions.response.dto';
export declare class ConfigureColumnInstructionsController {
    private readonly service;
    constructor(service: ConfigureColumnInstructionsService);
    handle(request: ConfigureColumnInstructionsRequestDto): Promise<ConfigureColumnInstructionsResponseDto>;
}
