import { AttachFileService } from './attach-file.service';
import { AttachFileRequestDto } from './attach-file.request.dto';
import { AttachFileResponseDto } from './attach-file.response.dto';
export declare class AttachFileController {
    private readonly service;
    constructor(service: AttachFileService);
    handle(taskKey: string, requestDto: AttachFileRequestDto): Promise<AttachFileResponseDto>;
}
