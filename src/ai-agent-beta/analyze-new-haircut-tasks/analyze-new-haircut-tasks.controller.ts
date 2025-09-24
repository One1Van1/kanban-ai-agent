// import { Controller, Post } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { AnalyzeNewHaircutTasksService } from './analyze-new-haircut-tasks.service';
// import { AnalyzeNewHaircutTasksResponse } from './analyze-new-haircut-tasks.interface';

// @ApiTags('ai-agent')
// @Controller('ai-agent')
// export class AnalyzeNewHaircutTasksController {
//   constructor(
//     private readonly analyzeNewHaircutTasksService: AnalyzeNewHaircutTasksService,
//   ) {}

//   /**
//    * Анализировать новые задачи о стрижках в колонке New
//    */
//   @Post('analyze-new-haircut-tasks')
//   @ApiOperation({
//     summary: 'Анализировать новые задачи о стрижках в колонке New',
//     description:
//       'AI анализирует только задачи о стрижках в колонке New и перемещает полные в In Progress, неполные в Questions',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Анализ новых задач стрижек завершен',
//     schema: {
//       example: {
//         tasksAnalyzed: 2,
//         tasksMoved: 2,
//         results: [
//           {
//             taskKey: 'KAN-5',
//             decision: 'move_to_progress',
//             reason: 'Haircut task has title, description and photo',
//             moved: true,
//             commentAdded: 'Стрижка займёт некоторое время',
//           },
//         ],
//       },
//     },
//   })
//   async analyzeNewHaircutTasks(): Promise<AnalyzeNewHaircutTasksResponse> {
//     return this.analyzeNewHaircutTasksService.analyzeNewHaircutTasks();
//   }
// }
