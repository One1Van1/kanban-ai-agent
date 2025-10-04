📘 AI-Agent Detailed Instruction Guide
🚩 Objective
Your primary goal as an AI agent is to extend an existing NestJS API, strictly adhering to the project's architectural principles:

Immutability: You NEVER edit or alter existing code, entities, or endpoints.

Atomicity: You create completely isolated feature modules, each corresponding to exactly ONE API action (endpoint).

Consistency: You reuse existing stable entities without modifications.

Self-contained: Every feature (action) resides entirely within its own folder.

📦 Project Structure
The project is structured as follows:

bash
Copy
Edit
src/
  features/ # all isolated API actions
    tasks/
      get-all/
        get-all.controller.ts
        get-all.service.ts
        get-all.query.dto.ts
        get-all.response.dto.ts
        get-all.spec.ts
        openapi.decorator.ts
      get-by-id/
        # same structure as above
      update-responsible/
        # same structure as above
  modules/ # aggregated modules importing controllers from features
    tasks.module.ts
  entities/ # stable, immutable entity definitions
    task.entity.ts
  common/ # shared utils, interceptors, decorators (immutable)
⚠️ Important Rules
Immutable Entities:

You MUST NEVER edit task.entity.ts or any other entity file.

If new data is needed, request architect intervention; NEVER add fields yourself.

Feature Isolation:

EVERY action (endpoint) MUST have its own isolated directory.

You MUST NEVER import code or DTOs from another feature action directory.

Shared logic is provided via existing, stable services like TaskRepository.

No Edits Allowed:

You NEVER edit or modify existing endpoints or actions.

You ONLY add new feature actions.

🧩 Feature Action Structure
Every isolated action you create must strictly follow this directory structure example (get-all):

bash
Copy
Edit
get-all/
  ├── get-all.controller.ts
  ├── get-all.service.ts
  ├── get-all.query.dto.ts
  ├── get-all.response.dto.ts
  ├── get-all.spec.ts
  └── openapi.decorator.ts
📌 Detailed File Instructions
✅ get-all.controller.ts
Exactly ONE controller per action.

Exactly ONE method per controller (corresponds to exactly one API endpoint).

Controller named explicitly after action and MUST include @ApiTags decorator with feature name.

**STRICT TYPING REQUIREMENTS:**
- Controller method MUST have explicit return type annotation matching the response DTO
- All parameters MUST be properly typed with validation pipes
- All DTOs MUST be used for request/response typing

typescript
Copy
Edit
@Controller('tasks')
@ApiTags('GetAllTasks')
export class GetAllTasksController {
  constructor(private readonly service: GetAllTasksService) {}

  @Get()
  @ApiGetAllTasks() // from openapi.decorator.ts
  async handle(@Query() query: GetAllTasksQueryDto): Promise<GetAllTasksResponseDto> {
    return this.service.execute(query);
  }
}

**REQUIRED TYPING PATTERNS:**

For GET endpoints with query parameters:
```typescript
async handle(@Query() query: QueryDto): Promise<ResponseDto>
```

For GET endpoints with path parameters:
```typescript
async handle(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto>
```

For GET endpoints with both:
```typescript
async handle(
  @Param('userId', ParseIntPipe) userId: number,
  @Query() query: QueryDto
): Promise<ResponseDto>
```

For POST endpoints:
```typescript
async handle(@Body() createDto: CreateRequestDto): Promise<CreateResponseDto>
```

For POST endpoints with authentication:
```typescript
async handle(
  @Body() createDto: CreateRequestDto,
  @CurrentUser() currentUser: User
): Promise<CreateResponseDto>
```

For POST endpoints with path parameters:
```typescript
async handle(
  @Param('taskId', ParseIntPipe) taskId: number,
  @Body() requestDto: RequestDto
): Promise<ResponseDto>
```

Important:

The route is short, simple (@Get(), @Post(), @Patch(':id'), etc.)

NEVER reuse controllers for multiple endpoints.

NEVER alter existing controllers.

ALWAYS add @ApiTags decorator with the feature name (e.g., 'GetAllTasks', 'GetUserTasks').

**MANDATORY:** All parameters and return types MUST be explicitly typed for proper Swagger generation.

**MANDATORY:** Use ParseIntPipe for all numeric path parameters.

**MANDATORY:** Return type MUST match the response DTO class name.

✅ get-all.service.ts
Exactly ONE service per action.

Exactly ONE public method: execute(...).

You MAY inject stable services (TaskRepository) or repositories (Repository<Task>).

NEVER import other action services or controllers.

typescript
Copy
Edit
@Injectable()
export class GetAllTasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(query: GetAllTasksQueryDto): Promise<GetAllTasksResponseDto> {
    const [items, total] = await this.taskRepository.findAndCount({
      take: query.limit,
      skip: (query.page - 1) * query.limit,
    });

    return new GetAllTasksResponseDto(items, total);
  }
}
Important:

All business logic resides ONLY here.

NEVER reuse service methods from other actions.

✅ DTOs (*.query.dto.ts, *.response.dto.ts)
Unique DTOs ONLY within your action folder.

Use descriptive, explicit DTO names tied explicitly to the action (GetAllTasksQueryDto, GetTaskByIdResponseDto, etc.)

NEVER import DTOs from other actions.

**ENUM HANDLING REQUIREMENTS:**
- ALL enum fields MUST use explicit enum arrays in @ApiProperty decorator
- Import enums from common/enums/ and use them in validation
- Always provide both enum constraint and example values for proper frontend generation

typescript
Copy
Edit
import { TaskStatus, TaskPriority } from '../../../common/enums/task.enum';

export class GetAllTasksQueryDto {
  @ApiProperty({ 
    enum: TaskStatus, 
    enumName: 'TaskStatus',
    example: TaskStatus.OPEN,
    description: 'Filter by task status'
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ 
    enum: TaskPriority, 
    enumName: 'TaskPriority',
    example: TaskPriority.HIGH,
    description: 'Filter by task priority'
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;
}

export class GetAllTasksResponseDto extends FormattedResponseDto<TaskDto[]> {
  constructor(items: TaskDto[], total: number) {
    super({ items, total });
  }
}

**MANDATORY ENUM PATTERNS:**

For status fields:
```typescript
@ApiProperty({ 
  enum: TaskStatus, 
  enumName: 'TaskStatus',
  example: TaskStatus.OPEN,
  description: 'Current task status'
})
@IsEnum(TaskStatus)
status: TaskStatus;
```

For priority fields:
```typescript
@ApiProperty({ 
  enum: TaskPriority, 
  enumName: 'TaskPriority',
  example: TaskPriority.HIGH,
  description: 'Task priority level'
})
@IsEnum(TaskPriority)
priority: TaskPriority;
```

For role fields:
```typescript
@ApiProperty({ 
  enum: TaskUserRole, 
  enumName: 'TaskUserRole',
  example: TaskUserRole.ASSIGNEE,
  description: 'User role in task'
})
@IsEnum(TaskUserRole)
role: TaskUserRole;
```

**Important enum rules:**
- ALWAYS use `enumName` property for proper frontend enum generation
- ALWAYS provide example with actual enum value
- ALWAYS import enums from common/enums/ directory
- NEVER use string arrays instead of proper enums
- ALWAYS use @IsEnum() validation decorator with the enum type

✅ openapi.decorator.ts
Define Swagger/OpenAPI decorator for the action WITHOUT ApiTags (tags are handled in controller):

typescript
Copy
Edit
export const ApiGetAllTasks = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all tasks paginated' }),
    ApiOkResponse({ type: GetAllTasksResponseDto }),
  );
Important:

DO NOT include ApiTags here - it's handled in the controller.

Clear, concise summary.

✅ get-all.spec.ts (Test)
Write E2E test explicitly testing ONLY this single endpoint.

MUST cover:

Successful path

Edge cases (validation errors, empty results)

NEVER test unrelated endpoints.

Example structure:

typescript
Copy
Edit
describe('GetAllTasksController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TasksModule, DatabaseModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return paginated tasks', async () => {
    return request(app.getHttpServer())
      .get('/tasks?limit=10&page=1')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('items');
        expect(res.body).toHaveProperty('total');
      });
  });
});
🔐 Architectural Boundaries (Critical)
You must strictly follow these rules:

Rule	Explanation
Immutable Entities	Never add fields or relations to existing entities.
Isolated Actions	Never import other actions' services, DTOs, or controllers.
Atomicity	One action = one endpoint = one folder.
Stable Core	Use ONLY provided stable entities and repositories.
DTO Isolation	Every action has its own unique DTO.
No Refactoring	NEVER modify existing files, even if you see "improvements."

📚 Workflow to Add New Action
Identify the exact endpoint you need (GET, POST, PATCH, etc.).

Create a NEW action directory under features/tasks/.

Follow EXACTLY the file structure and naming convention.

Write DTOs, Controller, Service, OpenAPI decorator, and test in strict isolation.

Add @ApiTags decorator to controller with feature name.

Request architect review.

NEVER touch other existing actions or entities.

⚠️ Common Mistakes to Avoid
❌ DON'T: Import DTOs or services from other action folders.

❌ DON'T: Alter stable entities (task.entity.ts).

❌ DON'T: Combine multiple endpoints into a single controller.

❌ DON'T: Create shared DTO files across actions.

❌ DON'T: Create index.ts files.

❌ DON'T: Add ApiTags to openapi.decorator.ts.

❌ DON'T: Use untyped parameters or return types (breaks Swagger).

❌ DON'T: Forget ParseIntPipe for numeric path parameters.

❌ DON'T: Use generic return types like Promise<any>.

❌ DON'T: Use string arrays instead of proper enums in @ApiProperty.

❌ DON'T: Forget enumName property in @ApiProperty for enum fields.

❌ DON'T: Use hardcoded string values instead of enum constants.

✅ Final Checklist
Before submitting your work, ensure:

 Action has its own isolated folder.

 Controller has @ApiTags decorator with feature name and exactly one public method.

 **Controller method has explicit return type matching response DTO.**

 **All parameters are properly typed with validation pipes.**

 **ParseIntPipe used for all numeric path parameters.**

 **All enum fields use proper @ApiProperty with enumName and example.**

 **All enum fields have @IsEnum() validation.**

 Service has exactly one public method.

 DTOs and Swagger decorators are unique.

 Tests pass successfully for your endpoint.

 No imports from other action directories.

 No edits made to existing entities or actions.

 No index.ts file created.

🚩 Summary
Your main job is simple yet strictly bounded:

Always EXTEND. Never MODIFY. Always ISOLATE.

🎉 You're ready!
Carefully follow these instructions for every API action you implement.