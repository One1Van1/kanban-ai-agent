// import { Test, TestingModule } from '@nestjs/testing';
// import { AnalyzeHaircutTasksService } from './analyze-haircut-tasks.service';
// import { GetColumnTasksService } from '../../jira/get-column-tasks/get-column-tasks.service';
// import { MoveTaskService } from '../../jira/move-task/move-task.service';
// import { AddTaskCommentService } from '../../jira/add-task-comment/add-task-comment.service';
// import { CheckEntityExistsService } from '../check-entity-exists/check-entity-exists.service';

// describe('AnalyzeHaircutTasksService', () => {
//   let service: AnalyzeHaircutTasksService;
//   let getColumnTasksService: jest.Mocked<GetColumnTasksService>;
//   let moveTaskService: jest.Mocked<MoveTaskService>;
//   let addTaskCommentService: jest.Mocked<AddTaskCommentService>;

//   beforeEach(async () => {
//     const mockGetColumnTasksService = {
//       getTasksFromColumn: jest.fn(),
//     };

//     const mockMoveTaskService = {
//       moveTaskToColumn: jest.fn(),
//     };

//     const mockAddTaskCommentService = {
//       addCommentToTask: jest.fn(),
//     };

//     const mockCheckEntityExistsService = {
//       execute: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AnalyzeHaircutTasksService,
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
//           provide: CheckEntityExistsService,
//           useValue: mockCheckEntityExistsService,
//         },
//       ],
//     }).compile();

//     service = module.get<AnalyzeHaircutTasksService>(
//       AnalyzeHaircutTasksService,
//     );
//     getColumnTasksService = module.get(GetColumnTasksService);
//     moveTaskService = module.get(MoveTaskService);
//     addTaskCommentService = module.get(AddTaskCommentService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('execute', () => {
//     it('should return empty results when no tasks found', async () => {
//       getColumnTasksService.getTasksFromColumn.mockResolvedValue({
//         columnName: 'New',
//         tasks: [],
//         totalCount: 0,
//         hasMore: false,
//       });

//       const result = await service.execute({ sourceColumn: 'New' });

//       expect(result).toEqual({
//         tasksAnalyzed: 0,
//         tasksMoved: 0,
//         results: [],
//       });
//     });

//     it('should move complete haircut task to In Progress', async () => {
//       const mockTask = {
//         id: '1',
//         key: 'KAN-13',
//         summary: 'Сделай мне такую стрижку',
//         description: 'Хочу стрижку как на этой фотографии',
//         status: { id: '1', name: 'New', categoryKey: 'new' },
//         assignee: undefined,
//         priority: { id: '3', name: 'Medium' },
//         issueType: { id: '1', name: 'Task' },
//         created: '2025-09-22T10:00:00.000Z',
//         updated: '2025-09-22T10:00:00.000Z',
//         labels: [],
//       };

//       getColumnTasksService.getTasksFromColumn.mockResolvedValue({
//         columnName: 'New',
//         tasks: [mockTask],
//         totalCount: 1,
//         hasMore: false,
//       });

//       moveTaskService.moveTaskToColumn.mockResolvedValue({
//         success: true,
//         taskKey: 'KAN-13',
//         fromStatus: 'New',
//         toStatus: 'In Progress',
//         message: 'Task moved successfully',
//       });

//       const result = await service.execute({ sourceColumn: 'New' });

//       expect(result.tasksAnalyzed).toBe(1);
//       expect(result.tasksMoved).toBe(1);
//       expect(result.results[0]).toMatchObject({
//         taskKey: 'KAN-13',
//         decision: 'move_to_progress',
//         moved: true,
//       });
//       expect(moveTaskService.moveTaskToColumn).toHaveBeenCalledWith(
//         'KAN-13',
//         'In Progress',
//       );
//     });

//     it('should move incomplete haircut task to Questions with comment', async () => {
//       const mockTask = {
//         id: '2',
//         key: 'KAN-14',
//         summary: 'Сделай мне такую стрижку',
//         description: '',
//         status: { id: '1', name: 'New', categoryKey: 'new' },
//         assignee: undefined,
//         priority: { id: '3', name: 'Medium' },
//         issueType: { id: '1', name: 'Task' },
//         created: '2025-09-22T10:00:00.000Z',
//         updated: '2025-09-22T10:00:00.000Z',
//         labels: [],
//       };

//       getColumnTasksService.getTasksFromColumn.mockResolvedValue({
//         columnName: 'New',
//         tasks: [mockTask],
//         totalCount: 1,
//         hasMore: false,
//       });

//       moveTaskService.moveTaskToColumn.mockResolvedValue({
//         success: true,
//         taskKey: 'KAN-14',
//         fromStatus: 'New',
//         toStatus: 'Questions',
//         message: 'Task moved successfully',
//       });

//       addTaskCommentService.addCommentToTask.mockResolvedValue({
//         success: true,
//         taskKey: 'KAN-14',
//         message: 'Comment added successfully',
//       });

//       const result = await service.execute({ sourceColumn: 'New' });

//       expect(result.tasksAnalyzed).toBe(1);
//       expect(result.tasksMoved).toBe(1);
//       expect(result.results[0]).toMatchObject({
//         taskKey: 'KAN-14',
//         decision: 'move_to_questions',
//         moved: true,
//         commentAdded: 'Какую именно стрижку ты хочешь?',
//       });
//       expect(moveTaskService.moveTaskToColumn).toHaveBeenCalledWith(
//         'KAN-14',
//         'Questions',
//       );
//       expect(addTaskCommentService.addCommentToTask).toHaveBeenCalledWith(
//         'KAN-14',
//         'Какую именно стрижку ты хочешь?',
//       );
//     });
//   });
// });
