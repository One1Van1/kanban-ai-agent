// import { Test, TestingModule } from '@nestjs/testing';
// import { AnalyzeNewHaircutTasksService } from './analyze-new-haircut-tasks.service';
// import { AiAgentSchedulerService } from '../shared/ai-agent-scheduler.service';
// import { GetColumnTasksService } from '../../jira/get-column-tasks/get-column-tasks.service';
// import { MoveTaskService } from '../../jira/move-task/move-task.service';
// import { AddTaskCommentService } from '../../jira/add-task-comment/add-task-comment.service';
// import { GetTaskService } from '../../jira/get-task/get-task.service';
// import { ConfigService } from '@nestjs/config';

// describe('AnalyzeNewHaircutTasksService', () => {
//   let service: AnalyzeNewHaircutTasksService;

//   const mockAiAgentSchedulerService = {
//     scheduleAiAgentAction: jest.fn(),
//   };

//   const mockGetColumnTasksService = {
//     getTasksFromColumn: jest.fn(),
//   };

//   const mockMoveTaskService = {
//     moveTaskToColumn: jest.fn(),
//   };

//   const mockAddTaskCommentService = {
//     addCommentToTask: jest.fn(),
//   };

//   const mockGetTaskService = {
//     getTaskByKey: jest.fn(),
//   };

//   const mockConfigService = {
//     get: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AnalyzeNewHaircutTasksService,
//         {
//           provide: AiAgentSchedulerService,
//           useValue: mockAiAgentSchedulerService,
//         },
//         {
//           provide: GetColumnTasksService,
//           useValue: mockGetColumnTasksService,
//         },
//         {
//           provide: MoveTaskService,
//           useValue: mockMoveTaskService,
//         },
//         {
//           provide: AddTaskCommentService,
//           useValue: mockAddTaskCommentService,
//         },
//         {
//           provide: GetTaskService,
//           useValue: mockGetTaskService,
//         },
//         {
//           provide: ConfigService,
//           useValue: mockConfigService,
//         },
//       ],
//     }).compile();

//     service = module.get<AnalyzeNewHaircutTasksService>(
//       AnalyzeNewHaircutTasksService,
//     );
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('analyzeNewHaircutTasks', () => {
//     it('should analyze and process haircut tasks from New column', async () => {
//       const mockTasks = [
//         {
//           id: '10001',
//           key: 'TEST-1',
//           summary: 'Сделать стрижку клиенту Иванову',
//           description: 'Необходимо подстричь волосы по фото',
//           status: 'New',
//           priority: 'Medium',
//           issueType: 'Task',
//           reporter: { displayName: 'Admin', accountId: 'admin' },
//           assignee: null,
//           created: '2024-01-01T00:00:00.000Z',
//           updated: '2024-01-01T00:00:00.000Z',
//         },
//       ];

//       mockGetColumnTasksService.getTasksFromColumn.mockResolvedValue({
//         tasks: mockTasks,
//         total: 1,
//       });

//       const mockTaskDetail = {
//         key: 'TEST-1',
//         fields: {
//           attachment: [
//             {
//               id: 'att-1',
//               filename: 'haircut-style.jpg',
//               size: 1024,
//               mimeType: 'image/jpeg',
//               created: '2024-01-01T00:00:00.000Z',
//               author: { displayName: 'Admin', accountId: 'admin' },
//             },
//           ],
//         },
//       };

//       mockGetTaskService.getTaskByKey.mockResolvedValue(mockTaskDetail);
//       mockMoveTaskService.moveTaskToColumn.mockResolvedValue({ success: true });
//       mockAddTaskCommentService.addCommentToTask.mockResolvedValue({
//         success: true,
//       });

//       const result = await service.analyzeNewHaircutTasks();

//       expect(result).toBeDefined();
//       expect(result.tasksAnalyzed).toBe(1);
//       expect(mockGetColumnTasksService.getTasksFromColumn).toHaveBeenCalledWith(
//         'New',
//         {
//           maxResults: 50,
//         },
//       );
//     });

//     it('should skip non-haircut related tasks', async () => {
//       const mockTasks = [
//         {
//           id: '10002',
//           key: 'TEST-2',
//           summary: 'Разработка веб-приложения',
//           description: 'Создать новое приложение на React',
//           status: 'New',
//           priority: 'High',
//           issueType: 'Task',
//           reporter: { displayName: 'Developer', accountId: 'dev' },
//           assignee: null,
//           created: '2024-01-01T00:00:00.000Z',
//           updated: '2024-01-01T00:00:00.000Z',
//         },
//       ];

//       mockGetColumnTasksService.getTasksFromColumn.mockResolvedValue({
//         tasks: mockTasks,
//         total: 1,
//       });

//       const mockTaskDetail = {
//         key: 'TEST-2',
//         fields: {
//           attachment: [], // Нет вложений
//         },
//       };

//       mockGetTaskService.getTaskByKey.mockResolvedValue(mockTaskDetail);

//       const result = await service.analyzeNewHaircutTasks();

//       expect(result).toBeDefined();
//       expect(result.tasksAnalyzed).toBe(1);
//       expect(result.tasksMoved).toBe(0); // Не связанные со стрижкой задачи не перемещаются
//     });
//   });
// });
