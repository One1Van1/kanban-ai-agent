// import { Test, TestingModule } from '@nestjs/testing';
// import { ConfigService } from '@nestjs/config';
// import { AnalyzeCompletedHaircutTasksService } from './analyze-completed-haircut-tasks.service';
// import { AnalyzeCompletedHaircutTasksController } from './analyze-completed-haircut-tasks.controller';
// import {
//   HaircutCategory,
//   ClientType,
//   TimeAnalysisStatus,
//   HaircutTaskAnalysisInput,
// } from './analyze-completed-haircut-tasks.interface';

// describe('AnalyzeCompletedHaircutTasksService', () => {
//   let service: AnalyzeCompletedHaircutTasksService;
//   let controller: AnalyzeCompletedHaircutTasksController;
//   let configService: ConfigService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AnalyzeCompletedHaircutTasksController],
//       providers: [
//         AnalyzeCompletedHaircutTasksService,
//         {
//           provide: ConfigService,
//           useValue: {
//             get: jest.fn((key: string) => {
//               switch (key) {
//                 case 'jira.baseUrl':
//                   return 'https://test.atlassian.net';
//                 case 'jira.authToken':
//                   return 'test-auth-token';
//                 default:
//                   return undefined;
//               }
//             }),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<AnalyzeCompletedHaircutTasksService>(
//       AnalyzeCompletedHaircutTasksService,
//     );
//     controller = module.get<AnalyzeCompletedHaircutTasksController>(
//       AnalyzeCompletedHaircutTasksController,
//     );
//     configService = module.get<ConfigService>(ConfigService);
//   });

//   describe('analyzeTask', () => {
//     it('should analyze fast haircut within time norm', async () => {
//       const input: HaircutTaskAnalysisInput = {
//         issueKey: 'HAIR-123',
//         taskTitle: 'Стрижка клиента №001',
//         taskDescription: 'Быстрая стрижка',
//         employeeComment: 'Сделал быструю стрижку, клиент не постоянный',
//         actualTimeMinutes: 25,
//       };

//       const result = await service.analyzeTask(input);

//       expect(result.success).toBe(true);
//       expect(result.issueKey).toBe('HAIR-123');
//       expect(result.category.original).toBe(HaircutCategory.FAST);
//       expect(result.category.wasUpdated).toBe(false);
//       expect(result.timeAnalysis.status).toBe(TimeAnalysisStatus.WITHIN_NORM);
//       expect(result.client.type).toBe(ClientType.NEW);
//       expect(result.price.finalPrice).toBe(400);
//       expect(result.requiresQuestion).toBe(false);
//     });

//     it('should analyze fast haircut for regular client with discount', async () => {
//       const input: HaircutTaskAnalysisInput = {
//         issueKey: 'HAIR-124',
//         taskTitle: 'Стрижка постоянного клиента',
//         taskDescription: 'Быстрая стрижка',
//         employeeComment: 'Выполнил быструю стрижку, клиент постоянный',
//         actualTimeMinutes: 22,
//       };

//       const result = await service.analyzeTask(input);

//       expect(result.success).toBe(true);
//       expect(result.client.type).toBe(ClientType.REGULAR);
//       expect(result.client.discountPercent).toBe(10);
//       expect(result.price.basePrice).toBe(400);
//       expect(result.price.discount).toBe(40);
//       expect(result.price.finalPrice).toBe(360);
//       expect(result.requiresQuestion).toBe(false);
//     });

//     it('should handle time exceeded with explanation', async () => {
//       const input: HaircutTaskAnalysisInput = {
//         issueKey: 'HAIR-125',
//         taskTitle: 'Сложная стрижка',
//         taskDescription: 'Быстрая стрижка',
//         employeeComment:
//           'Делал быструю стрижку, но клиент был нервный и постоянно двигался',
//         actualTimeMinutes: 45,
//       };

//       const result = await service.analyzeTask(input);

//       expect(result.success).toBe(true);
//       expect(result.timeAnalysis.status).toBe(TimeAnalysisStatus.EXCEEDED);
//       expect(result.explanation?.hasExplanation).toBe(true);
//       expect(result.explanation?.isValid).toBe(true);
//       expect(result.requiresQuestion).toBe(false); // есть объяснение
//       expect(result.price.finalPrice).toBe(400); // цена по исходной категории
//     });

//     it('should handle time exceeded without explanation - require question', async () => {
//       const input: HaircutTaskAnalysisInput = {
//         issueKey: 'HAIR-126',
//         taskTitle: 'Долгая стрижка',
//         taskDescription: 'Быстрая стрижка',
//         employeeComment: 'Делал быструю стрижку, потребовалось больше времени',
//         actualTimeMinutes: 45,
//       };

//       const result = await service.analyzeTask(input);

//       expect(result.success).toBe(true);
//       expect(result.timeAnalysis.status).toBe(TimeAnalysisStatus.EXCEEDED);
//       expect(result.explanation?.hasExplanation).toBe(false);
//       expect(result.requiresQuestion).toBe(true);
//       expect(result.moveToQuestions).toBe(true);
//       expect(result.agentComment).toContain(
//         'Время выполнения (45 мин) превышает норматив',
//       );
//     });

//     it('should handle category change in explanation', async () => {
//       const input: HaircutTaskAnalysisInput = {
//         issueKey: 'HAIR-127',
//         taskTitle: 'Стрижка с дополнительными услугами',
//         taskDescription: 'Быстрая стрижка',
//         employeeComment:
//           'Начинал как быструю стрижку, но клиент попросил покраску. На самом деле это была креативная стрижка',
//         actualTimeMinutes: 95,
//       };

//       const result = await service.analyzeTask(input);

//       expect(result.success).toBe(true);
//       expect(result.category.original).toBe(HaircutCategory.FAST);
//       expect(result.category.updated).toBe(HaircutCategory.CREATIVE);
//       expect(result.category.wasUpdated).toBe(true);
//       expect(result.timeAnalysis.status).toBe(TimeAnalysisStatus.WITHIN_NORM); // для креативной стрижки 95 мин - норма
//       expect(result.price.finalPrice).toBe(1500); // цена креативной стрижки
//       expect(result.requiresQuestion).toBe(false);
//     });

//     it('should handle regular haircut within norm', async () => {
//       const input: HaircutTaskAnalysisInput = {
//         issueKey: 'HAIR-128',
//         taskTitle: 'Обычная стрижка',
//         taskDescription: 'Обычная стрижка',
//         employeeComment:
//           'Выполнил обычную стрижку с переходами, клиент не постоянный',
//         actualTimeMinutes: 45,
//       };

//       const result = await service.analyzeTask(input);

//       expect(result.success).toBe(true);
//       expect(result.category.original).toBe(HaircutCategory.REGULAR);
//       expect(result.timeAnalysis.status).toBe(TimeAnalysisStatus.WITHIN_NORM);
//       expect(result.price.finalPrice).toBe(800);
//       expect(result.requiresQuestion).toBe(false);
//     });

//     it('should handle creative haircut within norm', async () => {
//       const input: HaircutTaskAnalysisInput = {
//         issueKey: 'HAIR-129',
//         taskTitle: 'Креативная стрижка с окраской',
//         taskDescription: 'Креативная стрижка',
//         employeeComment:
//           'Выполнил креативную стрижку с окраской и укладкой, клиент постоянный',
//         actualTimeMinutes: 110,
//       };

//       const result = await service.analyzeTask(input);

//       expect(result.success).toBe(true);
//       expect(result.category.original).toBe(HaircutCategory.CREATIVE);
//       expect(result.timeAnalysis.status).toBe(TimeAnalysisStatus.WITHIN_NORM);
//       expect(result.client.type).toBe(ClientType.REGULAR);
//       expect(result.price.basePrice).toBe(1500);
//       expect(result.price.discount).toBe(150);
//       expect(result.price.finalPrice).toBe(1350);
//       expect(result.requiresQuestion).toBe(false);
//     });
//   });

//   describe('Controller endpoints', () => {
//     it('should have analyze endpoint', () => {
//       expect(controller.analyzeTask).toBeDefined();
//     });

//     it('should have webhook endpoint', () => {
//       expect(controller.handleWebhook).toBeDefined();
//     });

//     it('should have employee response endpoint', () => {
//       expect(controller.processEmployeeResponse).toBeDefined();
//     });

//     it('should have analyze from Jira endpoint', () => {
//       expect(controller.analyzeTaskFromJira).toBeDefined();
//     });
//   });

//   describe('Private methods behavior', () => {
//     it('should extract category from description correctly', () => {
//       // Тестируем через public метод
//       const testInputs = [
//         { description: 'Быстрая стрижка', expected: HaircutCategory.FAST },
//         { description: 'Обычная стрижка', expected: HaircutCategory.REGULAR },
//         {
//           description: 'Креативная стрижка',
//           expected: HaircutCategory.CREATIVE,
//         },
//         { description: '', expected: HaircutCategory.FAST },
//       ];

//       testInputs.forEach(async ({ description, expected }) => {
//         const input: HaircutTaskAnalysisInput = {
//           issueKey: 'TEST',
//           taskTitle: 'Test',
//           taskDescription: description,
//           employeeComment: 'Test comment',
//           actualTimeMinutes: 30,
//         };

//         const result = await service.analyzeTask(input);
//         expect(result.category.original).toBe(expected);
//       });
//     });

//     it('should extract client type correctly', async () => {
//       const regularClientInput: HaircutTaskAnalysisInput = {
//         issueKey: 'TEST-REG',
//         taskTitle: 'Test',
//         taskDescription: 'Быстрая стрижка',
//         employeeComment: 'Клиент постоянный',
//         actualTimeMinutes: 25,
//       };

//       const newClientInput: HaircutTaskAnalysisInput = {
//         issueKey: 'TEST-NEW',
//         taskTitle: 'Test',
//         taskDescription: 'Быстрая стрижка',
//         employeeComment: 'Клиент не постоянный',
//         actualTimeMinutes: 25,
//       };

//       const regularResult = await service.analyzeTask(regularClientInput);
//       const newResult = await service.analyzeTask(newClientInput);

//       expect(regularResult.client.type).toBe(ClientType.REGULAR);
//       expect(regularResult.client.discountPercent).toBe(10);
//       expect(newResult.client.type).toBe(ClientType.NEW);
//       expect(newResult.client.discountPercent).toBe(0);
//     });
//   });
// });
