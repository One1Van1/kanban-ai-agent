export enum ActionType {
  CREATE_ENTITY = 'create_entity',
  CREATE_MODULE = 'create_module',
  CREATE_CONTROLLER = 'create_controller',
  CREATE_SERVICE = 'create_service',
  RUN_COMMAND = 'run_command',
  CREATE_FILE = 'create_file',
}

export interface ExecutionResult {
  success: boolean;
  message: string;
  files?: string[];
  command?: string;
  output?: string;
  error?: string;
}

export interface ExecutableAction {
  type: ActionType;
  description: string;
  entityName?: string;
  moduleName?: string;
  filePath?: string;
  content?: string;
  command?: string;
}

export interface TaskExecutionPlan {
  taskKey: string;
  summary: string;
  description: string;
  actions: ExecutableAction[];
  expectedResult: string;
}
