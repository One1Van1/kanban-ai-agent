// import { Body, Controller, Post } from '@nestjs/common';
// import { ExecuteHaircutTasksService } from './execute-haircut-tasks.service';
// import { ExecuteHaircutTasksDto } from './execute-haircut-tasks.dto';
// import { ExecuteHaircutTasksResponse } from './execute-haircut-tasks.interface';

// @Controller('ai-agent')
// export class ExecuteHaircutTasksController {
//   constructor(
//     private readonly executeHaircutTasksService: ExecuteHaircutTasksService,
//   ) {}

//   @Post('execute-haircut-tasks')
//   async executeHaircutTasks(
//     @Body() dto: ExecuteHaircutTasksDto,
//   ): Promise<ExecuteHaircutTasksResponse> {
//     return this.executeHaircutTasksService.execute(dto);
//   }
// }
