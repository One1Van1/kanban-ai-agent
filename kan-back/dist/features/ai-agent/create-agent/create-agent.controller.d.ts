import { CreateAgentService } from './create-agent.service';
import { CreateAgentRequestDto } from './create-agent.request.dto';
import { CreateAgentResponseDto } from './create-agent.response.dto';
export declare class CreateAgentController {
    private readonly createAgentService;
    private readonly logger;
    constructor(createAgentService: CreateAgentService);
    handle(requestDto: CreateAgentRequestDto): Promise<CreateAgentResponseDto>;
}
