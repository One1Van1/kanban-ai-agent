import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardIntegration } from '../../../entities/board-integration.entity';
import { Agent } from '../../../entities/agent.entity';
import { BoardIntegrationFactory } from '../../../shared/board-integration.factory';
import { CreateBoardIntegrationRequestDto } from './create-board-integration.request.dto';
import { CreateBoardIntegrationResponseDto } from './create-board-integration.response.dto';

@Injectable()
export class CreateBoardIntegrationService {
  constructor(
    @InjectRepository(BoardIntegration)
    private readonly boardIntegrationRepository: Repository<BoardIntegration>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    private readonly boardIntegrationFactory: BoardIntegrationFactory,
  ) {}

  async execute(
    dto: CreateBoardIntegrationRequestDto,
  ): Promise<CreateBoardIntegrationResponseDto> {
    // Проверяем, что агент существует
    const agent = await this.agentRepository.findOne({
      where: { id: dto.agentId },
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${dto.agentId} not found`);
    }

    // Проверяем, поддерживается ли данный тип доски
    if (!this.boardIntegrationFactory.isSupported(dto.boardType)) {
      throw new BadRequestException(
        `Board type ${dto.boardType} is not supported`,
      );
    }

    // Валидируем конфигурацию
    const validationResult = await this.boardIntegrationFactory.validateConfig(
      dto.boardType,
      dto.config,
    );

    if (!validationResult.valid) {
      throw new BadRequestException({
        message: 'Invalid board configuration',
        errors: validationResult.errors,
      });
    }

    // Тестируем подключение
    let connectionTest = false;
    try {
      connectionTest = await this.boardIntegrationFactory.testConnection(
        dto.boardType,
        dto.config,
      );
    } catch (error) {
      console.warn(
        `Connection test failed for ${dto.boardType}:`,
        error.message,
      );
      // Не блокируем создание интеграции, если тест подключения неудачен
      // Пользователь может исправить конфигурацию позже
    }

    // Создаем интеграцию
    const boardIntegration = this.boardIntegrationRepository.create({
      agentId: dto.agentId,
      boardType: dto.boardType,
      name: dto.name,
      description: dto.description,
      config: dto.config,
      isActive: dto.isActive ?? true,
      fieldMappings: dto.fieldMappings,
      statusMappings: dto.statusMappings,
    });

    const savedIntegration =
      await this.boardIntegrationRepository.save(boardIntegration);

    return {
      id: savedIntegration.id,
      agentId: savedIntegration.agentId,
      boardType: savedIntegration.boardType,
      name: savedIntegration.name,
      description: savedIntegration.description,
      isActive: savedIntegration.isActive,
      connectionTest,
      createdAt: savedIntegration.createdAt,
      updatedAt: savedIntegration.updatedAt,
    };
  }
}
