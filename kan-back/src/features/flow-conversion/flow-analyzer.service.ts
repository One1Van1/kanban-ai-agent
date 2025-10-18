import { Injectable, Logger } from '@nestjs/common';
import {
  FlowDefinitionData,
  FlowBlockData,
  FlowConnectionData,
  FlowConversionMetadata,
  FlowAnalysisResult,
} from '../../types/flow-definition.types';

/**
 * Сервис для анализа Flow графа
 * Выполняет топологическую сортировку, определяет порядок выполнения,
 * находит циклы и строит граф зависимостей
 */
@Injectable()
export class FlowAnalyzerService {
  private readonly logger = new Logger(FlowAnalyzerService.name);

  /**
   * Полный анализ Flow
   */
  async analyzeFlow(
    definition: FlowDefinitionData,
  ): Promise<FlowAnalysisResult> {
    this.logger.log('Starting Flow analysis...');

    const errors: string[] = [];
    const warnings: string[] = [];

    // Базовая валидация
    if (!definition.blocks || definition.blocks.length === 0) {
      errors.push('Flow must have at least one block');
    }

    // Получаем connections (поддержка legacy и нового формата)
    const connections = this.getConnections(definition);

    // Проверка циклов
    const hasCycles = this.detectCycles(definition.blocks, connections);
    if (hasCycles) {
      warnings.push(
        'Flow contains cycles - infinite loops may occur during execution',
      );
    }

    // Строим граф выполнения
    const executionGraph = await this.buildExecutionGraph(
      definition.blocks,
      connections,
    );

    // Вычисляем максимальную глубину
    const maxDepth = this.calculateMaxDepth(definition.blocks, connections);

    // Статистика
    const statistics = {
      totalBlocks: definition.blocks.length,
      totalConnections: connections.length,
      triggerCount: definition.blocks.filter((b) => b.type === 'trigger')
        .length,
      actionCount: definition.blocks.filter((b) => b.type === 'action').length,
      logicCount: definition.blocks.filter((b) => b.type === 'logic').length,
      maxDepth,
      hasCycles,
    };

    this.logger.log('Flow analysis complete:', statistics);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      statistics,
      executionGraph,
    };
  }

  /**
   * Получает connections с поддержкой legacy формата
   */
  private getConnections(definition: FlowDefinitionData): FlowConnectionData[] {
    // Новый формат connections
    if (definition.connections && definition.connections.length > 0) {
      return definition.connections.map((conn) => ({
        ...conn,
        source: conn.source || conn.from || '',
        target: conn.target || conn.to || '',
      }));
    }

    // Legacy формат edges
    if (definition.edges && definition.edges.length > 0) {
      return definition.edges.map((edge) => ({
        ...edge,
        source: edge.source || edge.from || '',
        target: edge.target || edge.to || '',
      }));
    }

    return [];
  }

  /**
   * Строит граф выполнения с топологической сортировкой
   */
  async buildExecutionGraph(
    blocks: FlowBlockData[],
    connections: FlowConnectionData[],
  ): Promise<FlowConversionMetadata> {
    this.logger.log('Building execution graph...');

    // Топологическая сортировка
    const executionOrder = this.topologicalSort(blocks, connections);

    // Граф зависимостей
    const dependencies: Record<string, string[]> = {};
    blocks.forEach((block) => {
      dependencies[block.id] = connections
        .filter((conn) => conn.target === block.id)
        .map((conn) => conn.source);
    });

    // Условные ветвления
    const conditionalBranches = this.extractConditionalBranches(
      blocks,
      connections,
    );

    // Уровни выполнения (для параллельного выполнения)
    const executionLevels = this.calculateExecutionLevels(
      blocks,
      connections,
      executionOrder,
    );

    // Точки входа (triggers)
    const entryPoints = blocks
      .filter((b) => b.type === 'trigger')
      .map((b) => b.id);

    // Точки выхода (блоки без исходящих connections)
    const exitPoints = blocks
      .filter(
        (b) =>
          !connections.some((conn) => conn.source === b.id) ||
          b.type === 'action',
      )
      .map((b) => b.id);

    return {
      executionOrder,
      dependencies,
      conditionalBranches,
      executionLevels,
      entryPoints,
      exitPoints,
      analysisVersion: '1.0.0',
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Топологическая сортировка (Kahn's algorithm)
   */
  private topologicalSort(
    blocks: FlowBlockData[],
    connections: FlowConnectionData[],
  ): string[] {
    const result: string[] = [];
    const inDegree: Map<string, number> = new Map();
    const adjacencyList: Map<string, string[]> = new Map();

    // Инициализация
    blocks.forEach((block) => {
      inDegree.set(block.id, 0);
      adjacencyList.set(block.id, []);
    });

    // Построение графа
    connections.forEach((conn) => {
      adjacencyList.get(conn.source)?.push(conn.target);
      inDegree.set(conn.target, (inDegree.get(conn.target) || 0) + 1);
    });

    // Находим стартовые блоки (без входящих связей)
    const queue: string[] = [];
    inDegree.forEach((degree, blockId) => {
      if (degree === 0) {
        queue.push(blockId);
      }
    });

    // Обход графа
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const neighbors = adjacencyList.get(current) || [];
      neighbors.forEach((neighbor) => {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);

        if (newDegree === 0) {
          queue.push(neighbor);
        }
      });
    }

    return result;
  }

  /**
   * Извлекает информацию о условных ветвлениях
   */
  private extractConditionalBranches(
    blocks: FlowBlockData[],
    connections: FlowConnectionData[],
  ): Record<
    string,
    {
      trueBranch?: string[];
      falseBranch?: string[];
      errorBranch?: string[];
      successBranch?: string[];
    }
  > {
    const branches: Record<string, any> = {};

    // Находим logic блоки
    const logicBlocks = blocks.filter((b) => b.type === 'logic');

    logicBlocks.forEach((block) => {
      const outgoingConnections = connections.filter(
        (conn) => conn.source === block.id,
      );

      if (outgoingConnections.length > 0) {
        branches[block.id] = {};

        outgoingConnections.forEach((conn) => {
          const condition =
            conn.condition ||
            conn.sourceHandle ||
            conn.label?.toLowerCase() ||
            'default';

          if (condition.includes('true')) {
            if (!branches[block.id].trueBranch)
              branches[block.id].trueBranch = [];
            branches[block.id].trueBranch.push(conn.target);
          } else if (condition.includes('false')) {
            if (!branches[block.id].falseBranch)
              branches[block.id].falseBranch = [];
            branches[block.id].falseBranch.push(conn.target);
          } else if (condition.includes('error')) {
            if (!branches[block.id].errorBranch)
              branches[block.id].errorBranch = [];
            branches[block.id].errorBranch.push(conn.target);
          } else if (condition.includes('success')) {
            if (!branches[block.id].successBranch)
              branches[block.id].successBranch = [];
            branches[block.id].successBranch.push(conn.target);
          }
        });
      }
    });

    return branches;
  }

  /**
   * Вычисляет уровни выполнения для параллельного выполнения
   */
  private calculateExecutionLevels(
    blocks: FlowBlockData[],
    connections: FlowConnectionData[],
    executionOrder: string[],
  ): string[][] {
    const levels: string[][] = [];
    const levelMap: Map<string, number> = new Map();

    // Инициализация - entry points на уровне 0
    const entryPoints = blocks
      .filter(
        (b) =>
          b.type === 'trigger' ||
          !connections.some((conn) => conn.target === b.id),
      )
      .map((b) => b.id);

    entryPoints.forEach((id) => {
      levelMap.set(id, 0);
      if (!levels[0]) levels[0] = [];
      levels[0].push(id);
    });

    // Вычисление уровней
    executionOrder.forEach((blockId) => {
      if (levelMap.has(blockId)) return;

      // Находим максимальный уровень зависимостей
      const dependencies = connections
        .filter((conn) => conn.target === blockId)
        .map((conn) => conn.source);

      const maxLevel =
        dependencies.length > 0
          ? Math.max(...dependencies.map((dep) => levelMap.get(dep) || 0))
          : 0;

      const level = maxLevel + 1;
      levelMap.set(blockId, level);

      if (!levels[level]) levels[level] = [];
      levels[level].push(blockId);
    });

    return levels;
  }

  /**
   * Определяет наличие циклов в графе (DFS)
   */
  private detectCycles(
    blocks: FlowBlockData[],
    connections: FlowConnectionData[],
  ): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const adjacencyList: Map<string, string[]> = new Map();
    blocks.forEach((block) => adjacencyList.set(block.id, []));
    connections.forEach((conn) => {
      adjacencyList.get(conn.source)?.push(conn.target);
    });

    const hasCycleDFS = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const neighbors = adjacencyList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycleDFS(neighbor)) return true;
        } else if (recursionStack.has(neighbor)) {
          return true; // Цикл найден
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const block of blocks) {
      if (!visited.has(block.id)) {
        if (hasCycleDFS(block.id)) return true;
      }
    }

    return false;
  }

  /**
   * Вычисляет максимальную глубину графа
   */
  private calculateMaxDepth(
    blocks: FlowBlockData[],
    connections: FlowConnectionData[],
  ): number {
    const adjacencyList: Map<string, string[]> = new Map();
    blocks.forEach((block) => adjacencyList.set(block.id, []));
    connections.forEach((conn) => {
      adjacencyList.get(conn.source)?.push(conn.target);
    });

    const depthMap = new Map<string, number>();

    const calculateDepth = (nodeId: string): number => {
      if (depthMap.has(nodeId)) {
        return depthMap.get(nodeId)!;
      }

      const neighbors = adjacencyList.get(nodeId) || [];
      if (neighbors.length === 0) {
        depthMap.set(nodeId, 0);
        return 0;
      }

      const maxChildDepth = Math.max(
        ...neighbors.map((neighbor) => calculateDepth(neighbor)),
      );
      const depth = maxChildDepth + 1;
      depthMap.set(nodeId, depth);
      return depth;
    };

    const entryPoints = blocks.filter(
      (b) => !connections.some((conn) => conn.target === b.id),
    );

    return entryPoints.length > 0
      ? Math.max(...entryPoints.map((b) => calculateDepth(b.id)))
      : 0;
  }
}
