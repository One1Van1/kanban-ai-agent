// import { Injectable, Logger } from '@nestjs/common';
// import { AnalyzeNewTasksService } from '../analyze-new-tasks/analyze-new-tasks.service';
// import { CheckProgressTasksService } from '../check-progress-tasks/check-progress-tasks.service';
// import { ExecuteTasksService } from '../execute-tasks/execute-tasks.service';
// import { RunAutoWorkflowResponse } from './run-auto-workflow.interface';

// @Injectable()
// export class RunAutoWorkflowService {
//   private readonly logger = new Logger(RunAutoWorkflowService.name);

//   constructor(
//     private readonly analyzeNewTasksService: AnalyzeNewTasksService,
//     private readonly checkProgressTasksService: CheckProgressTasksService,
//     private readonly executeTasksService: ExecuteTasksService,
//   ) {}

//   async runAutoWorkflow(): Promise<RunAutoWorkflowResponse> {
//     const startTime = Date.now();
//     this.logger.log('🚀 Starting AI auto workflow...');

//     try {
//       // 1. Анализируем задачи в New
//       const newTasksResult =
//         await this.analyzeNewTasksService.analyzeNewTasks();
//       this.logger.log(`📝 New tasks: ${newTasksResult.tasksMoved} moved`);

//       // 2. Выполняем задачи в In Progress
//       const executeTasksResult = await this.executeTasksService.executeTasks();
//       this.logger.log(
//         `⚡ Executed tasks: ${executeTasksResult.successfulExecutions}/${executeTasksResult.tasksExecuted} successful`,
//       );

//       // 3. Проверяем готовность задач в In Progress
//       const progressTasksResult =
//         await this.checkProgressTasksService.checkProgressTasks();
//       this.logger.log(
//         `🔍 Progress tasks: ${progressTasksResult.tasksMoved} moved to review`,
//       );

//       const endTime = Date.now();
//       const duration = endTime - startTime;

//       const result: RunAutoWorkflowResponse = {
//         timestamp: new Date().toISOString(),
//         newTasks: {
//           analyzed: newTasksResult.tasksAnalyzed,
//           moved: newTasksResult.tasksMoved,
//         },
//         progressTasks: {
//           checked: progressTasksResult.tasksChecked,
//           moved: progressTasksResult.tasksMoved,
//         },
//         executedTasks: {
//           executed: executeTasksResult.tasksExecuted,
//           successful: executeTasksResult.successfulExecutions,
//         },
//         totalMoved: newTasksResult.tasksMoved + progressTasksResult.tasksMoved,
//         duration,
//       };

//       this.logger.log(
//         `✅ Auto workflow complete in ${duration}ms. Tasks moved: ${result.totalMoved}, Executed: ${result.executedTasks.successful}`,
//       );
//       return result;
//     } catch (error) {
//       this.logger.error('❌ Auto workflow failed:', error.message);
//       throw error;
//     }
//   }
// }
