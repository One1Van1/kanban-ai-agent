// import { Injectable } from '@nestjs/common';
// import { AiBaseService } from '../shared/ai-base.service';
// import { CheckProgressTasksResponse } from './check-progress-tasks.interface';
// import { TaskProgressResult } from '../types/ai-agent.interface';

// @Injectable()
// export class CheckProgressTasksService extends AiBaseService {
//   async checkProgressTasks(): Promise<CheckProgressTasksResponse> {
//     this.logger.log('🤖 Starting check of tasks in In Progress column...');

//     try {
//       // Получаем все задачи из колонки In Progress
//       const progressTasks = await this.getColumnTasksService.getTasksFromColumn(
//         'In Progress',
//         { maxResults: 50 },
//       );

//       this.logger.log(
//         `Found ${progressTasks.tasks.length} tasks in In Progress column`,
//       );

//       const results: CheckProgressTasksResponse['results'] = [];
//       let tasksMoved = 0;

//       // Проверяем каждую задачу
//       for (const task of progressTasks.tasks) {
//         const analysis: TaskProgressResult = await this.analyzeProgressTask(
//           task.key,
//           task.summary,
//           task.description, // Используем реальное описание задачи
//         );

//         // Выполняем решение
//         const moved = await this.executeProgressDecision(analysis);
//         if (moved) tasksMoved++;

//         results.push({
//           taskKey: task.key,
//           decision: analysis.decision,
//           reason: analysis.reason,
//           moved,
//         });

//         this.logger.log(
//           `Task ${task.key}: ${analysis.decision} - ${moved ? 'MOVED' : 'STAYED'}`,
//         );
//       }

//       const response: CheckProgressTasksResponse = {
//         tasksChecked: progressTasks.tasks.length,
//         tasksMoved,
//         results,
//       };

//       this.logger.log(
//         `✅ Check complete: ${tasksMoved}/${progressTasks.tasks.length} tasks moved`,
//       );
//       return response;
//     } catch (error) {
//       this.logger.error('❌ Failed to check progress tasks:', error.message);
//       throw error;
//     }
//   }
// }
