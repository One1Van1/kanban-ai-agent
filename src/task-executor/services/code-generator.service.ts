import { Injectable, Logger } from '@nestjs/common';
import {
  ActionType,
  ExecutableAction,
  ExecutionResult,
} from '../interfaces/execution.interface';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class CodeGeneratorService {
  private readonly logger = new Logger(CodeGeneratorService.name);

  /**
   * Генерирует Entity класс
   */
  generateEntity(entityName: string): string {
    const className = this.capitalize(entityName);

    return `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('${entityName.toLowerCase()}s')
export class ${className} {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
`;
  }

  /**
   * Генерирует Service класс
   */
  generateService(entityName: string): string {
    const className = this.capitalize(entityName);

    return `import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${className} } from '../entities/${entityName.toLowerCase()}.entity';

export interface Create${className}Dto {
  name: string;
  description?: string;
}

export interface Update${className}Dto {
  name?: string;
  description?: string;
}

@Injectable()
export class ${className}sService {
  constructor(
    @InjectRepository(${className})
    private readonly ${entityName.toLowerCase()}Repository: Repository<${className}>,
  ) {}

  async findAll(): Promise<${className}[]> {
    return this.${entityName.toLowerCase()}Repository.find();
  }

  async findOne(id: number): Promise<${className}> {
    const ${entityName.toLowerCase()} = await this.${entityName.toLowerCase()}Repository.findOne({ where: { id } });
    if (!${entityName.toLowerCase()}) {
      throw new NotFoundException(\`${className} with ID \${id} not found\`);
    }
    return ${entityName.toLowerCase()};
  }

  async create(create${className}Dto: Create${className}Dto): Promise<${className}> {
    const ${entityName.toLowerCase()} = this.${entityName.toLowerCase()}Repository.create(create${className}Dto);
    return this.${entityName.toLowerCase()}Repository.save(${entityName.toLowerCase()});
  }

  async update(id: number, update${className}Dto: Update${className}Dto): Promise<${className}> {
    await this.findOne(id); // Проверяем существование
    await this.${entityName.toLowerCase()}Repository.update(id, update${className}Dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.${entityName.toLowerCase()}Repository.delete(id);
  }
}
`;
  }

  /**
   * Генерирует Controller класс
   */
  generateController(entityName: string): string {
    const className = this.capitalize(entityName);

    return `import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ${className}sService, Create${className}Dto, Update${className}Dto } from './${entityName.toLowerCase()}s.service';

@Controller('${entityName.toLowerCase()}s')
export class ${className}sController {
  constructor(private readonly ${entityName.toLowerCase()}sService: ${className}sService) {}

  @Post()
  create(@Body() create${className}Dto: Create${className}Dto) {
    return this.${entityName.toLowerCase()}sService.create(create${className}Dto);
  }

  @Get()
  findAll() {
    return this.${entityName.toLowerCase()}sService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.${entityName.toLowerCase()}sService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() update${className}Dto: Update${className}Dto,
  ) {
    return this.${entityName.toLowerCase()}sService.update(id, update${className}Dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.${entityName.toLowerCase()}sService.remove(id);
  }
}
`;
  }

  /**
   * Генерирует Module класс
   */
  generateModule(entityName: string): string {
    const className = this.capitalize(entityName);

    return `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${className}sService } from './${entityName.toLowerCase()}s.service';
import { ${className}sController } from './${entityName.toLowerCase()}s.controller';
import { ${className} } from '../entities/${entityName.toLowerCase()}.entity';

@Module({
  imports: [TypeOrmModule.forFeature([${className}])],
  controllers: [${className}sController],
  providers: [${className}sService],
  exports: [${className}sService],
})
export class ${className}sModule {}
`;
  }

  /**
   * Создает все файлы для сущности
   */
  async createEntityFiles(
    entityName: string,
    basePath: string,
  ): Promise<ExecutionResult> {
    try {
      const className = this.capitalize(entityName);
      const moduleName = entityName.toLowerCase() + 's';

      // Создаем директории
      const entitiesDir = path.join(basePath, 'src', 'entities');
      const moduleDir = path.join(basePath, 'src', moduleName);

      await fs.mkdir(entitiesDir, { recursive: true });
      await fs.mkdir(moduleDir, { recursive: true });

      // Пути к файлам
      const entityFile = path.join(
        entitiesDir,
        `${entityName.toLowerCase()}.entity.ts`,
      );
      const serviceFile = path.join(moduleDir, `${moduleName}.service.ts`);
      const controllerFile = path.join(
        moduleDir,
        `${moduleName}.controller.ts`,
      );
      const moduleFile = path.join(moduleDir, `${moduleName}.module.ts`);

      // Генерируем и записываем файлы
      await fs.writeFile(entityFile, this.generateEntity(entityName));
      await fs.writeFile(serviceFile, this.generateService(entityName));
      await fs.writeFile(controllerFile, this.generateController(entityName));
      await fs.writeFile(moduleFile, this.generateModule(entityName));

      const createdFiles = [
        entityFile,
        serviceFile,
        controllerFile,
        moduleFile,
      ];

      this.logger.log(
        `✅ Создана сущность ${className} с файлами: ${createdFiles.join(', ')}`,
      );

      return {
        success: true,
        message: `Сущность ${className} успешно создана`,
        files: createdFiles,
      };
    } catch (error) {
      this.logger.error(`❌ Ошибка создания сущности ${entityName}:`, error);
      return {
        success: false,
        message: `Ошибка создания сущности: ${error.message}`,
        error: error.message,
      };
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
