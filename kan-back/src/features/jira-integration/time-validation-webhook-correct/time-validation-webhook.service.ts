import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { TimeValidationWebhookRequestDto } from './time-validation-webhook.request.dto';
import { TimeValidationWebhookResponseDto } from './time-validation-webhook.response.dto';

@Injectable()
export class TimeValidationWebhookService extends JiraBaseService {
  async execute(
    requestDto: TimeValidationWebhookRequestDto,
  ): Promise<TimeValidationWebhookResponseDto> {
    try {
      const issueKey = requestDto.issue?.key || 'unknown';

      this.logger.log(`Validating time for issue: ${issueKey}`);

      const validationResult = await this.validateTimeSpent(requestDto.issue);

      return new TimeValidationWebhookResponseDto(
        'validated',
        issueKey,
        validationResult.isValid,
        validationResult.details,
      );
    } catch (error) {
      this.logger.error(
        `Failed to validate time for issue: ${requestDto.issue?.key}`,
        error.stack,
      );

      return new TimeValidationWebhookResponseDto(
        'error',
        requestDto.issue?.key || 'unknown',
        false,
        { error: error.message },
      );
    }
  }

  private async validateTimeSpent(
    issue: any,
  ): Promise<{ isValid: boolean; details: any }> {
    const timeSpent = issue?.fields?.timespent || 0; // в секундах
    const timeEstimate = issue?.fields?.timeoriginalestimate || 0; // в секундах
    const status = issue?.fields?.status?.name || 'Unknown';

    // Простая логика валидации
    let isValid = true;
    const warnings = [];

    // Проверка 1: Если задача закрыта, но нет времени
    if (status === 'Done' && timeSpent === 0) {
      isValid = false;
      warnings.push('Задача закрыта, но не указано время работы');
    }

    // Проверка 2: Превышение оценки более чем на 50%
    if (timeEstimate > 0 && timeSpent > timeEstimate * 1.5) {
      warnings.push('Превышение оценки более чем на 50%');
    }

    // Проверка 3: Очень мало времени для задачи в работе
    if (status === 'In Progress' && timeSpent > 0 && timeSpent < 900) {
      // меньше 15 минут
      warnings.push('Очень мало времени для задачи в работе');
    }

    const efficiency =
      timeEstimate > 0 ? Math.round((timeSpent / timeEstimate) * 100) : 0;

    return {
      isValid,
      details: {
        timeSpent: timeSpent,
        timeSpentHours: Math.round((timeSpent / 3600) * 100) / 100,
        timeEstimate: timeEstimate,
        timeEstimateHours: Math.round((timeEstimate / 3600) * 100) / 100,
        efficiency: efficiency,
        status: status,
        warnings: warnings,
      },
    };
  }
}
