import { ConfigureContextSourcesService } from './configure-context-sources.service';
import { ConfigureContextSourcesRequestDto } from './configure-context-sources.request.dto';
import { ConfigureContextSourcesResponseDto } from './configure-context-sources.response.dto';
export declare class ConfigureContextSourcesController {
    private readonly service;
    constructor(service: ConfigureContextSourcesService);
    handle(request: ConfigureContextSourcesRequestDto): Promise<ConfigureContextSourcesResponseDto>;
}
