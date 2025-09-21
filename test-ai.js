import { AIAnalysisService } from '../ai-analysis/ai-analysis.service';
import { ConfigService } from '@nestjs/config';

// Простой тест AI Analysis без NestJS контекста
async function testAIAnalysis() {
  const configService = {
    get: (key) => {
      const config = {
        'claude.apiKey': '',
        'claude.model': 'claude-3-sonnet-20240229',
      };
      return config[key];
    },
  };

  const aiService = new AIAnalysisService(configService);

  // Тестируем с реальными задачами из вашей Jira
  const testTasks = [
    {
      key: 'KAN-4',
      summary: 'Создать сущность',
      issueType: { name: 'Task' },
    },
    {
      key: 'KAN-8',
      summary: 'Test webhook system',
      issueType: { name: 'Task' },
    },
  ];

  console.log('🧠 Testing AI Analysis Service...\n');

  for (const task of testTasks) {
    try {
      console.log(`📋 Analyzing task: ${task.key} - "${task.summary}"`);

      const analysis = await aiService.analyzeTask(task);

      console.log(`✅ Analysis Result:`);
      console.log(`   Type: ${analysis.analysisType}`);
      console.log(`   Complexity: ${analysis.complexity}`);
      console.log(`   Can Auto Execute: ${analysis.canAutoExecute}`);
      console.log(`   Estimated Time: ${analysis.estimatedTime} minutes`);
      console.log(`   Actions: ${analysis.requiredActions.join(', ')}`);
      console.log(`   Reasoning: ${analysis.reasoning}\n`);
    } catch (error) {
      console.error(`❌ Error analyzing ${task.key}:`, error.message);
    }
  }

  // Тест приоритизации
  console.log('🎯 Testing Priority Analysis...\n');

  try {
    const prioritized = await aiService.analyzePriority(testTasks);
    console.log('✅ Prioritized tasks:');
    prioritized.forEach((task, index) => {
      console.log(`   ${index + 1}. ${task.key}: ${task.summary}`);
    });
  } catch (error) {
    console.error('❌ Priority analysis error:', error.message);
  }
}

testAIAnalysis().catch(console.error);
