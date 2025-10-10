// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { Repository } from 'typeorm';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { GetBoardStructureController } from './get-board-structure.controller';
// import { GetBoardStructureService } from './get-board-structure.service';
// import { TaskHistory } from '@/entities/task-history.entity';
// describe('GetBoardStructureController (e2e)', () => {
//   let app: INestApplication;
//   let taskHistoryRepository: Repository<TaskHistory>;
//   let module: TestingModule;

//   const mockTaskHistoryData = [
//     {
//       id: 'task-1',
//       taskId: 'task-id-1',
//       taskKey: 'TASK-123',
//       taskTitle: 'Implement authentication',
//       toColumn: 'todo',
//       toStatus: 'todo',
//       context: {
//         priority: 'high',
//         assignment: { assigneeEmail: 'dev@example.com' },
//       },
//       createdAt: new Date('2024-01-01T10:00:00Z'),
//     },
//     {
//       id: 'task-2',
//       taskId: 'task-id-2',
//       taskKey: 'TASK-124',
//       taskTitle: 'Fix login bug',
//       toColumn: 'in-progress',
//       toStatus: 'in-progress',
//       context: {
//         priority: 'urgent',
//         assignment: { assigneeEmail: 'senior@example.com' },
//       },
//       createdAt: new Date('2024-01-01T09:00:00Z'),
//     },
//     {
//       id: 'task-3',
//       taskId: 'task-id-3',
//       taskKey: 'TASK-125',
//       taskTitle: 'Code review',
//       toColumn: 'in-review',
//       toStatus: 'in-review',
//       context: {
//         priority: 'medium',
//       },
//       createdAt: new Date('2024-01-01T08:00:00Z'),
//     },
//   ];

//   const mockTaskHistoryRepository = {
//     createQueryBuilder: jest.fn(),
//   };

//   const mockQueryBuilder = {
//     select: jest.fn().mockReturnThis(),
//     where: jest.fn().mockReturnThis(),
//     andWhere: jest.fn().mockReturnThis(),
//     orderBy: jest.fn().mockReturnThis(),
//     limit: jest.fn().mockReturnThis(),
//     getRawMany: jest.fn(),
//     getMany: jest.fn(),
//   };

//   beforeEach(async () => {
//     module = await Test.createTestingModule({
//       controllers: [GetBoardStructureController],
//       providers: [
//         GetBoardStructureService,
//         {
//           provide: getRepositoryToken(TaskHistory),
//           useValue: mockTaskHistoryRepository,
//         },
//       ],
//     }).compile();

//     app = module.createNestApplication();
//     await app.init();

//     taskHistoryRepository = module.get<Repository<TaskHistory>>(
//       getRepositoryToken(TaskHistory),
//     );

//     // Setup default mock behavior
//     mockTaskHistoryRepository.createQueryBuilder.mockReturnValue(
//       mockQueryBuilder,
//     );
//     mockQueryBuilder.getRawMany.mockResolvedValue([]);
//     mockQueryBuilder.getMany.mockResolvedValue([]);
//   });

//   afterEach(async () => {
//     await app.close();
//     jest.clearAllMocks();
//   });

//   describe('GET /kanban/board/structure', () => {
//     it('should return basic board structure without optional parameters', async () => {
//       // Act
//       const response = await request(app.getHttpServer())
//         .get('/kanban/board/structure')
//         .expect(200);

//       // Assert
//       expect(response.body).toEqual({
//         success: true,
//         message: 'Board structure retrieved successfully',
//         boardId: 'default-board',
//         boardName: 'Kanban Board default-board',
//         columns: expect.arrayContaining([
//           expect.objectContaining({
//             id: 'todo',
//             name: 'todo',
//             displayName: 'To Do',
//             order: 1,
//             allowedStatuses: ['todo'],
//             statusTransitions: ['in-progress', 'blocked', 'cancelled'],
//             description: 'Tasks ready to be started',
//             color: '#64748b',
//             taskCount: 0,
//           }),
//           expect.objectContaining({
//             id: 'in-progress',
//             name: 'in-progress',
//             displayName: 'In Progress',
//             order: 2,
//             allowedStatuses: ['in-progress'],
//             statusTransitions: ['in-review', 'blocked', 'todo', 'cancelled'],
//             wipLimit: 5,
//             description: 'Tasks currently being worked on',
//             color: '#3b82f6',
//             taskCount: 0,
//           }),
//           expect.objectContaining({
//             id: 'done',
//             name: 'done',
//             displayName: 'Done',
//             order: 5,
//             allowedStatuses: ['done'],
//             statusTransitions: ['in-review', 'testing'],
//             description: 'Completed tasks',
//             color: '#10b981',
//             taskCount: 0,
//           }),
//         ]),
//         workflow: {
//           name: 'Standard Development Workflow',
//           description:
//             'Default workflow for development tasks with proper quality gates',
//           allowedTransitions: {
//             todo: ['in-progress', 'blocked', 'cancelled'],
//             'in-progress': ['in-review', 'blocked', 'todo', 'cancelled'],
//             'in-review': ['testing', 'in-progress', 'done', 'blocked'],
//             testing: ['done', 'in-review', 'blocked'],
//             done: ['in-review', 'testing'],
//             blocked: ['todo', 'in-progress', 'cancelled'],
//             cancelled: ['todo'],
//           },
//           statuses: [
//             'todo',
//             'in-progress',
//             'in-review',
//             'testing',
//             'done',
//             'blocked',
//             'cancelled',
//           ],
//         },
//         totalTasks: 0,
//         timestamp: expect.any(String),
//       });

//       expect(response.body.columns).toHaveLength(8); // All default columns
//       expect(response.body.metadata).toBeUndefined(); // Not included by default
//     });

//     it('should return board structure with task counts', async () => {
//       // Arrange
//       mockQueryBuilder.getRawMany
//         .mockResolvedValueOnce([{ taskId: 'task-1' }, { taskId: 'task-2' }]) // todo: 2 tasks
//         .mockResolvedValueOnce([{ taskId: 'task-3' }]) // in-progress: 1 task
//         .mockResolvedValue([]); // Other columns: 0 tasks

//       // Act
//       const response = await request(app.getHttpServer())
//         .get('/kanban/board/structure?includeTaskCounts=true')
//         .expect(200);

//       // Assert
//       expect(response.body.success).toBe(true);
//       expect(response.body.totalTasks).toBeGreaterThan(0);

//       const todoColumn = response.body.columns.find((col) => col.id === 'todo');
//       expect(todoColumn.taskCount).toBeDefined();

//       // Verify query was called for task counts
//       expect(mockTaskHistoryRepository.createQueryBuilder).toHaveBeenCalled();
//     });

//     it('should return board structure with metadata', async () => {
//       // Act
//       const response = await request(app.getHttpServer())
//         .get(
//           '/kanban/board/structure?includeMetadata=true&agentId=test-agent&purpose=task_planning',
//         )
//         .expect(200);

//       // Assert
//       expect(response.body.success).toBe(true);
//       expect(response.body.metadata).toEqual({
//         lastUpdated: expect.any(String),
//         activeUsers: 8,
//         recentActivity: expect.any(String),
//         agentAccessLevel: 'full',
//         availableActions: [
//           'create',
//           'move',
//           'assign',
//           'comment',
//           'status_change',
//         ],
//         boardSettings: {
//           autoAssignment: true,
//           notifications: true,
//           wipLimitsEnabled: true,
//         },
//         requestedBy: 'test-agent',
//         purpose: 'task_planning',
//       });

//       // Columns should include detailed metadata
//       const todoColumn = response.body.columns.find((col) => col.id === 'todo');
//       expect(todoColumn.metadata).toEqual({
//         wipLimit: null,
//         requiresAssignment: false,
//         category: 'ready',
//       });

//       const inProgressColumn = response.body.columns.find(
//         (col) => col.id === 'in-progress',
//       );
//       expect(inProgressColumn.metadata).toEqual({
//         requiresAssignment: true,
//         trackTime: true,
//         category: 'active',
//       });
//     });

//     it('should return board structure with sample tasks', async () => {
//       // Arrange
//       mockQueryBuilder.getMany.mockResolvedValueOnce(
//         mockTaskHistoryData.slice(0, 2),
//       ); // todo samples
//       mockQueryBuilder.getMany.mockResolvedValueOnce(
//         mockTaskHistoryData.slice(1, 2),
//       ); // in-progress samples

//       // Act
//       const response = await request(app.getHttpServer())
//         .get(
//           '/kanban/board/structure?includeSampleTasks=true&sampleTasksLimit=2',
//         )
//         .expect(200);

//       // Assert
//       expect(response.body.success).toBe(true);

//       const columnWithSamples = response.body.columns.find(
//         (col) => col.sampleTasks && col.sampleTasks.length > 0,
//       );
//       if (columnWithSamples) {
//         expect(columnWithSamples.sampleTasks).toEqual(
//           expect.arrayContaining([
//             expect.objectContaining({
//               id: expect.any(String),
//               title: expect.any(String),
//               status: expect.any(String),
//               priority: expect.any(String),
//               createdAt: expect.any(String),
//             }),
//           ]),
//         );
//         expect(columnWithSamples.sampleTasks.length).toBeLessThanOrEqual(2);
//       }

//       // Verify sample tasks query was called
//       expect(mockQueryBuilder.limit).toHaveBeenCalledWith(2);
//     });

//     it('should filter by board ID', async () => {
//       // Act
//       const response = await request(app.getHttpServer())
//         .get(
//           '/kanban/board/structure?boardId=project-alpha&includeTaskCounts=true',
//         )
//         .expect(200);

//       // Assert
//       expect(response.body.success).toBe(true);
//       expect(response.body.boardId).toBe('project-alpha');
//       expect(response.body.boardName).toBe('Kanban Board project-alpha');

//       // Verify boardId filter was applied in queries
//       if (mockQueryBuilder.andWhere.mock.calls.length > 0) {
//         expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
//           'task_history.context @> :boardFilter',
//           { boardFilter: JSON.stringify({ boardId: 'project-alpha' }) },
//         );
//       }
//     });

//     it('should handle disabled status transitions', async () => {
//       // Act
//       const response = await request(app.getHttpServer())
//         .get('/kanban/board/structure?includeStatusTransitions=false')
//         .expect(200);

//       // Assert
//       expect(response.body.success).toBe(true);

//       const todoColumn = response.body.columns.find((col) => col.id === 'todo');
//       expect(todoColumn.statusTransitions).toBeUndefined();
//     });

//     it('should validate sample tasks limit', async () => {
//       // Act - Test upper limit
//       const response1 = await request(app.getHttpServer())
//         .get('/kanban/board/structure?sampleTasksLimit=15')
//         .expect(400);

//       // Assert
//       expect(response1.body.statusCode).toBe(400);
//       expect(response1.body.message).toContain(
//         'sampleTasksLimit must not be greater than 10',
//       );

//       // Act - Test lower limit
//       const response2 = await request(app.getHttpServer())
//         .get('/kanban/board/structure?sampleTasksLimit=0')
//         .expect(400);

//       // Assert
//       expect(response2.body.statusCode).toBe(400);
//       expect(response2.body.message).toContain(
//         'sampleTasksLimit must not be less than 1',
//       );
//     });

//     it('should validate boolean parameters', async () => {
//       // Act
//       const response = await request(app.getHttpServer())
//         .get('/kanban/board/structure?includeTaskCounts=invalid')
//         .expect(400);

//       // Assert
//       expect(response.body.statusCode).toBe(400);
//       expect(response.body.message).toContain(
//         'includeTaskCounts must be a boolean value',
//       );
//     });

//     it('should return all columns in correct order', async () => {
//       // Act
//       const response = await request(app.getHttpServer())
//         .get('/kanban/board/structure')
//         .expect(200);

//       // Assert
//       expect(response.body.success).toBe(true);
//       expect(response.body.columns).toHaveLength(8);

//       const columnNames = response.body.columns.map((col) => col.name);
//       expect(columnNames).toEqual([
//         'backlog',
//         'todo',
//         'in-progress',
//         'in-review',
//         'testing',
//         'done',
//         'blocked',
//         'cancelled',
//       ]);

//       // Verify order is correct
//       for (let i = 0; i < response.body.columns.length - 1; i++) {
//         expect(response.body.columns[i].order).toBeLessThan(
//           response.body.columns[i + 1].order,
//         );
//       }
//     });

//     it('should include workflow with all status transitions', async () => {
//       // Act
//       const response = await request(app.getHttpServer())
//         .get('/kanban/board/structure')
//         .expect(200);

//       // Assert
//       expect(response.body.workflow).toEqual({
//         name: 'Standard Development Workflow',
//         description:
//           'Default workflow for development tasks with proper quality gates',
//         allowedTransitions: {
//           todo: ['in-progress', 'blocked', 'cancelled'],
//           'in-progress': ['in-review', 'blocked', 'todo', 'cancelled'],
//           'in-review': ['testing', 'in-progress', 'done', 'blocked'],
//           testing: ['done', 'in-review', 'blocked'],
//           done: ['in-review', 'testing'],
//           blocked: ['todo', 'in-progress', 'cancelled'],
//           cancelled: ['todo'],
//         },
//         statuses: [
//           'todo',
//           'in-progress',
//           'in-review',
//           'testing',
//           'done',
//           'blocked',
//           'cancelled',
//         ],
//       });
//     });

//     it('should handle database errors gracefully', async () => {
//       // Arrange
//       mockQueryBuilder.getRawMany.mockRejectedValueOnce(
//         new Error('Database connection failed'),
//       );

//       // Act - Should still return structure but with 0 task counts
//       const response = await request(app.getHttpServer())
//         .get('/kanban/board/structure?includeTaskCounts=true')
//         .expect(200);

//       // Assert
//       expect(response.body.success).toBe(true);
//       expect(response.body.columns.every((col) => col.taskCount === 0)).toBe(
//         true,
//       );
//     });

//     it('should handle complex query combinations', async () => {
//       // Act
//       const response = await request(app.getHttpServer())
//         .get('/kanban/board/structure')
//         .query({
//           boardId: 'complex-project',
//           includeTaskCounts: true,
//           includeMetadata: true,
//           includeStatusTransitions: true,
//           includeSampleTasks: true,
//           sampleTasksLimit: 5,
//           agentId: 'complex-agent-123',
//           purpose: 'comprehensive_analysis',
//         })
//         .expect(200);

//       // Assert
//       expect(response.body.success).toBe(true);
//       expect(response.body.boardId).toBe('complex-project');
//       expect(response.body.metadata.requestedBy).toBe('complex-agent-123');
//       expect(response.body.metadata.purpose).toBe('comprehensive_analysis');

//       // All columns should have metadata
//       response.body.columns.forEach((column) => {
//         expect(column.metadata).toBeDefined();
//         expect(column.statusTransitions).toBeDefined();
//         expect(column.taskCount).toBeDefined();
//       });
//     });
//   });
// });
