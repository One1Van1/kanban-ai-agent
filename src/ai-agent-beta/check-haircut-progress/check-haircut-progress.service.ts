// import { Injectable } from '@nestjs/common';
// import { AiBaseService } from '../shared/ai-base.service';
// import { GetColumnTasksService } from '../../jira/get-column-tasks/get-column-tasks.service';
// import { MoveTaskService } from '../../jira/move-task/move-task.service';
// import { AddTaskCommentService } from '../../jira/add-task-comment/add-task-comment.service';
// import {
//   CheckHaircutProgressResponse,
//   HaircutProgressResult,
// } from './check-haircut-progress.interface';
// import { TaskProgressResult } from '../types/ai-agent.interface';

// @Injectable()
// export class CheckHaircutProgressService extends AiBaseService {
//   constructor(
//     getColumnTasksService: GetColumnTasksService,
//     moveTaskService: MoveTaskService,
//     addTaskCommentService: AddTaskCommentService,
//   ) {
//     super(getColumnTasksService, moveTaskService, addTaskCommentService);
//   }

//   async checkHaircutProgress(): Promise<CheckHaircutProgressResponse> {
//     this.logger.log('✂️ Starting progress check for HAIRCUT TASKS only...');

//     try {
//       // Получаем все задачи из колонки In Progress
//       const progressTasks = await this.getColumnTasksService.getTasksFromColumn(
//         'In Progress',
//         { maxResults: 50 },
//       );

//       this.logger.log(
//         `Found ${progressTasks.tasks.length} tasks in In Progress column`,
//       );

//       const results: HaircutProgressResult[] = [];
//       let tasksMovedToReview = 0;

//       // Проверяем каждую задачу, но ТОЛЬКО стрижки
//       for (const task of progressTasks.tasks) {
//         const text = (
//           task.summary +
//           ' ' +
//           (task.description || '')
//         ).toLowerCase();

//         // Проверяем, является ли задача о стрижке
//         if (!this.isHaircutRelated(text)) {
//           this.logger.debug(
//             `Task ${task.key} is not haircut-related, skipping`,
//           );
//           continue; // Пропускаем НЕ-стрижки
//         }

//         this.logger.log(
//           `✂️ Checking haircut progress: ${task.key} - ${task.summary}`,
//         );

//         // Анализируем прогресс стрижки
//         const progressAnalysis = await this.analyzeHaircutProgress(
//           task.key,
//           task.summary,
//           task.description,
//         );

//         // Выполняем решение
//         const moved = await this.executeProgressDecision(progressAnalysis);
//         if (moved && progressAnalysis.decision === 'move_to_review') {
//           tasksMovedToReview++;
//         }

//         results.push({
//           taskKey: task.key,
//           decision: progressAnalysis.decision,
//           reason: progressAnalysis.reason,
//           moved,
//           commentAdded: moved ? progressAnalysis.suggestedComment : undefined,
//         });

//         this.logger.log(
//           `✂️ Haircut progress ${task.key}: ${progressAnalysis.decision} - ${moved ? 'MOVED' : 'STAYED'}`,
//         );
//       }

//       const response: CheckHaircutProgressResponse = {
//         tasksChecked: results.length,
//         tasksMovedToReview,
//         results,
//       };

//       this.logger.log(
//         `✂️ Haircut progress check complete: ${tasksMovedToReview}/${results.length} haircuts moved to Review`,
//       );

//       return response;
//     } catch (error) {
//       this.logger.error('✂️ Error checking haircut progress:', error.message);
//       throw error;
//     }
//   }

//   private async analyzeHaircutProgress(
//     taskKey: string,
//     summary: string,
//     description?: string,
//   ): Promise<TaskProgressResult> {
//     this.logger.log(`Analyzing haircut progress: ${taskKey}`);

//     // Для стрижек - логика простая:
//     // Если задача в In Progress и это стрижка, значит она готова к review
//     // (потому что execute-haircut-tasks уже должен был её обработать)

//     return {
//       taskKey,
//       isCompleted: true,
//       decision: 'move_to_review',
//       reason: 'Haircut task in progress is ready for review',
//       suggestedComment: 'AI: Стрижка выполнена, готово к проверке.',
//     };
//   }
// }
