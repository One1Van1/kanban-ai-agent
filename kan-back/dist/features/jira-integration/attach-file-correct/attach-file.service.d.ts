import { AttachFileRequestDto } from './attach-file.request.dto';
import { AttachFileResponseDto } from './attach-file.response.dto';
export declare class AttachFileService {
    execute(taskKey: string, requestDto: AttachFileRequestDto): Promise<AttachFileResponseDto>;
}
