// import { Controller, Post } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { CheckProgressTasksService } from './check-progress-tasks.service';
// import { CheckProgressTasksResponse } from './check-progress-tasks.interface';

// @ApiTags('ai-agent')
// @Controller('ai-agent')
// export class CheckProgressTasksController {
//   constructor(
//     private readonly checkProgressTasksService: CheckProgressTasksService,
//   ) {}

//   /**
//    * Проверить все задачи в колонке In Progress
//    */
//   @Post('check-progress-tasks')
//   @ApiOperation({
//     summary: 'Проверить задачи в колонке In Progress',
//     description:
//       'AI проверяет все задачи в колонке In Progress и перемещает завершенные в Review',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Проверка завершена',
//     schema: {
//       example: {
//         tasksChecked: 2,
//         tasksMoved: 1,
//         results: [
//           {
//             taskKey: 'KAN-6',
//             decision: 'move_to_review',
//             reason: 'Task appears to be completed',
//             moved: true,
//           },
//         ],
//       },
//     },
//   })
//   async checkProgressTasks(): Promise<CheckProgressTasksResponse> {
//     return this.checkProgressTasksService.checkProgressTasks();
//   }
// }
