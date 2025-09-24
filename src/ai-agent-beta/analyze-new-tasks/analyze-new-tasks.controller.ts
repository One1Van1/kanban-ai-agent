// import { Controller, Post } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { AnalyzeNewTasksService } from './analyze-new-tasks.service';
// import { AnalyzeNewTasksResponse } from './analyze-new-tasks.interface';

// @ApiTags('ai-agent')
// @Controller('ai-agent')
// export class AnalyzeNewTasksController {
//   constructor(
//     private readonly analyzeNewTasksService: AnalyzeNewTasksService,
//   ) {}

//   /**
//    * Анализировать все задачи в колонке New
//    */
//   @Post('analyze-new-tasks')
//   @ApiOperation({
//     summary: 'Анализировать задачи в колонке New',
//     description:
//       'AI анализирует все задачи в колонке New и перемещает понятные в In Progress, непонятные в Questions',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Анализ завершен',
//     schema: {
//       example: {
//         tasksAnalyzed: 3,
//         tasksMoved: 2,
//         results: [
//           {
//             taskKey: 'KAN-5',
//             decision: 'move_to_progress',
//             reason: 'Task is clear and well-defined',
//             moved: true,
//           },
//         ],
//       },
//     },
//   })
//   async analyzeNewTasks(): Promise<AnalyzeNewTasksResponse> {
//     return this.analyzeNewTasksService.analyzeNewTasks();
//   }
// }
