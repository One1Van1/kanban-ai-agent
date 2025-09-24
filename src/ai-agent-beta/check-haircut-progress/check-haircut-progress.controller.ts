// import { Controller, Post } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { CheckHaircutProgressService } from './check-haircut-progress.service';
// import { CheckHaircutProgressResponse } from './check-haircut-progress.interface';

// @ApiTags('ai-agent')
// @Controller('ai-agent')
// export class CheckHaircutProgressController {
//   constructor(
//     private readonly checkHaircutProgressService: CheckHaircutProgressService,
//   ) {}

//   /**
//    * Проверить прогресс задач стрижек в колонке In Progress
//    */
//   @Post('check-haircut-progress')
//   @ApiOperation({
//     summary: 'Проверить прогресс задач стрижек в In Progress',
//     description:
//       'AI проверяет только задачи о стрижках в колонке In Progress и перемещает готовые в Review',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Проверка прогресса стрижек завершена',
//     schema: {
//       example: {
//         tasksChecked: 3,
//         tasksMovedToReview: 2,
//         results: [
//           {
//             taskKey: 'KAN-7',
//             decision: 'move_to_review',
//             reason: 'Haircut task is ready for review',
//             moved: true,
//             commentAdded: 'AI: Стрижка выполнена, готово к проверке.',
//           },
//         ],
//       },
//     },
//   })
//   async checkHaircutProgress(): Promise<CheckHaircutProgressResponse> {
//     return this.checkHaircutProgressService.checkHaircutProgress();
//   }
// }
