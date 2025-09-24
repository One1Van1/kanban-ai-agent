// import { Test, TestingModule } from '@nestjs/testing';
// import { CheckHaircutProgressService } from './check-haircut-progress.service';
// import { AiAgentSchedulerService } from '../shared/ai-agent-scheduler.service';
// import { GetColumnTasksService } from '../../jira/get-column-tasks/get-column-tasks.service';
// import { MoveTaskService } from '../../jira/move-task/move-task.service';
// import { AddTaskCommentService } from '../../jira/add-task-comment/add-task-comment.service';
// import { ConfigService } from '@nestjs/config';

// describe('CheckHaircutProgressService', () => {
//   let service: CheckHaircutProgressService;

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

//   const mockConfigService = {
//     get: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         CheckHaircutProgressService,
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
//           provide: ConfigService,
//           useValue: mockConfigService,
//         },
//       ],
//     }).compile();

//     service = module.get<CheckHaircutProgressService>(
//       CheckHaircutProgressService,
//     );
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('checkHaircutProgress', () => {
//     it('should check and process haircut tasks from In Progress column', async () => {
//       const mockTasks = [
//         {
//           id: '10001',
//           key: 'TEST-1',
//           summary: 'Сделать стрижку клиенту Иванову',
//           description: 'Необходимо подстричь волосы по фото',
//           status: 'In Progress',
//           priority: 'Medium',
//           issueType: 'Task',
//           reporter: { displayName: 'Admin', accountId: 'admin' },
//           assignee: { displayName: 'Barber', accountId: 'barber' },
//           created: '2024-01-01T00:00:00.000Z',
//           updated: '2024-01-01T00:00:00.000Z',
//         },
//       ];

//       mockGetColumnTasksService.getTasksFromColumn.mockResolvedValue({
//         tasks: mockTasks,
//         total: 1,
//       });

//       mockMoveTaskService.moveTaskToColumn.mockResolvedValue({ success: true });
//       mockAddTaskCommentService.addCommentToTask.mockResolvedValue({
//         success: true,
//       });

//       const result = await service.checkHaircutProgress();

//       expect(result).toBeDefined();
//       expect(result.tasksChecked).toBe(1);
//       expect(mockGetColumnTasksService.getTasksFromColumn).toHaveBeenCalledWith(
//         'In Progress',
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
//           status: 'In Progress',
//           priority: 'High',
//           issueType: 'Task',
//           reporter: { displayName: 'Developer', accountId: 'dev' },
//           assignee: { displayName: 'Programmer', accountId: 'prog' },
//           created: '2024-01-01T00:00:00.000Z',
//           updated: '2024-01-01T00:00:00.000Z',
//         },
//       ];

//       mockGetColumnTasksService.getTasksFromColumn.mockResolvedValue({
//         tasks: mockTasks,
//         total: 1,
//       });

//       const result = await service.checkHaircutProgress();

//       expect(result).toBeDefined();
//       expect(result.tasksChecked).toBe(1);
//       expect(result.tasksMovedToReview).toBe(0); // Не связанные со стрижкой задачи не перемещаются
//     });
//   });
// });
