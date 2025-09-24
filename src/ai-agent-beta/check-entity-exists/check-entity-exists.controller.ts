// import { Controller, Post, Body } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { CheckEntityExistsService } from './check-entity-exists.service';
// import { CheckEntityExistsDto } from './check-entity-exists.dto';
// import { CheckEntityExistsResponse } from './check-entity-exists.interface';

// @ApiTags('ai-agent')
// @Controller('ai-agent')
// export class CheckEntityExistsController {
//   constructor(
//     private readonly checkEntityExistsService: CheckEntityExistsService,
//   ) {}

//   /**
//    * Проверить существование сущности в проекте
//    */
//   @Post('check-entity-exists')
//   @ApiOperation({
//     summary: 'Проверить существование сущности',
//     description:
//       'Проверяет существует ли указанная сущность в папке src/generated/entities/',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Результат проверки',
//     schema: {
//       example: {
//         entityName: 'Order',
//         exists: true,
//         filePath: '/path/to/order.entity.ts',
//         fields: ['id', 'userId', 'totalAmount', 'status'],
//       },
//     },
//   })
//   async checkEntityExists(
//     @Body() dto: CheckEntityExistsDto,
//   ): Promise<CheckEntityExistsResponse> {
//     return this.checkEntityExistsService.checkEntityExists(dto.entityName);
//   }
// }
