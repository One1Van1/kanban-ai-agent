import { registerAs } from '@nestjs/config';

export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
  statusMapping: {
    new: string;
    questions: string;
    inProgress: string;
    review: string;
    done: string;
  };
}

export default registerAs(
  'jira',
  (): JiraConfig => ({
    baseUrl: process.env.JIRA_BASE_URL || '',
    email: process.env.JIRA_EMAIL || '',
    apiToken: process.env.JIRA_API_TOKEN || '',
    projectKey: process.env.JIRA_PROJECT_KEY || '',
    statusMapping: {
      new: process.env.JIRA_STATUS_NEW || 'To Do',
      questions: process.env.JIRA_STATUS_QUESTIONS || 'Questions',
      inProgress: process.env.JIRA_STATUS_IN_PROGRESS || 'In Progress',
      review: process.env.JIRA_STATUS_REVIEW || 'Review',
      done: process.env.JIRA_STATUS_DONE || 'Done',
    },
  }),
);
