// import { Injectable } from '@nestjs/common';
// import { AiBaseService } from '../shared/ai-base.service';
// import { AnalyzeNewTasksResponse } from './analyze-new-tasks.interface';
// import { TaskAnalysisResult } from '../types/ai-agent.interface';

// @Injectable()
// export class AnalyzeNewTasksService extends AiBaseService {
//   async analyzeNewTasks(): Promise<AnalyzeNewTasksResponse> {
//     this.logger.log('🤖 Starting analysis of tasks in New column...');

//     try {
//       // Получаем все задачи из колонки New
//       const newTasks = await this.getColumnTasksService.getTasksFromColumn(
//         'New',
//         { maxResults: 50 },
//       );

//       this.logger.log(`Found ${newTasks.tasks.length} tasks in New column`);

//       const results: AnalyzeNewTasksResponse['results'] = [];
//       let tasksMoved = 0;

//       // Анализируем каждую задачу
//       for (const task of newTasks.tasks) {
//         const analysis: TaskAnalysisResult = this.analyzeNewTask(
//           task.key,
//           task.summary,
//           task.description, // Используем реальное описание задачи
//         );

//         // Выполняем решение
//         const moved = await this.executeTaskDecision(analysis);
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

//       const response: AnalyzeNewTasksResponse = {
//         tasksAnalyzed: newTasks.tasks.length,
//         tasksMoved,
//         results,
//       };

//       this.logger.log(
//         `✅ Analysis complete: ${tasksMoved}/${newTasks.tasks.length} tasks moved`,
//       );
//       return response;
//     } catch (error) {
//       this.logger.error('❌ Failed to analyze new tasks:', error.message);
//       throw error;
//     }
//   }
// }
