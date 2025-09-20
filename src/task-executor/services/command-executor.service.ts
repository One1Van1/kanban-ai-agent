import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class CommandExecutorService {
  private readonly logger = new Logger(CommandExecutorService.name);

  async executeCommand(
    command: string,
    args: string[] = [],
    workingDir?: string,
  ): Promise<{
    success: boolean;
    output: string;
    error: string;
  }> {
    return new Promise((resolve) => {
      this.logger.log(`🔧 Выполняю команду: ${command} ${args.join(' ')}`);

      const child = spawn(command, args, {
        cwd: workingDir || process.cwd(),
        stdio: 'pipe',
        shell: true,
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        const success = code === 0;

        if (success) {
          this.logger.log(`✅ Команда выполнена успешно: ${command}`);
        } else {
          this.logger.error(
            `❌ Команда завершилась с ошибкой (код ${code}): ${command}`,
          );
        }

        resolve({
          success,
          output: stdout,
          error: stderr,
        });
      });

      child.on('error', (error) => {
        this.logger.error(`❌ Ошибка выполнения команды ${command}:`, error);
        resolve({
          success: false,
          output: '',
          error: error.message,
        });
      });
    });
  }

  /**
   * Выполняет yarn команды
   */
  async executeYarnCommand(
    command: string,
    args: string[] = [],
  ): Promise<{
    success: boolean;
    output: string;
    error: string;
  }> {
    return this.executeCommand('yarn', [command, ...args]);
  }

  /**
   * Выполняет nest cli команды
   */
  async executeNestCommand(
    command: string,
    args: string[] = [],
  ): Promise<{
    success: boolean;
    output: string;
    error: string;
  }> {
    return this.executeCommand('nest', [command, ...args]);
  }

  /**
   * Генерирует NestJS ресурс через CLI
   */
  async generateNestResource(
    resourceName: string,
    type: 'resource' | 'module' | 'controller' | 'service' = 'resource',
  ): Promise<{
    success: boolean;
    output: string;
    error: string;
  }> {
    return this.executeNestCommand('generate', [type, resourceName]);
  }
}
