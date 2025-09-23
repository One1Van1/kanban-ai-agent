import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import jiraConfig from '../../config/jira.config';
import { AttachFileResponse } from './attach-file.interface';
import * as fs from 'fs';
import * as FormData from 'form-data';
import axios from 'axios';

@Injectable()
export class AttachFileService {
  private readonly baseUrl: string;
  private readonly auth: string;

  constructor(
    @Inject(jiraConfig.KEY)
    private readonly jiraConf: ConfigType<typeof jiraConfig>,
  ) {
    this.baseUrl = this.jiraConf.baseUrl;
    this.auth = `Basic ${Buffer.from(
      `${this.jiraConf.email}:${this.jiraConf.apiToken}`,
    ).toString('base64')}`;
  }

  async attachFile(taskKey: string, file: any): Promise<AttachFileResponse[]> {
    const url = `${this.baseUrl}/rest/api/3/issue/${taskKey}/attachments`;

    const form = new FormData();
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    try {
      const response = await axios.post(url, form, {
        headers: {
          Authorization: this.auth,
          'X-Atlassian-Token': 'no-check',
          ...form.getHeaders(),
        },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          `Failed to attach file: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`,
          error.response.status,
        );
      }
      throw new HttpException(
        `Failed to attach file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async attachFileFromPath(
    taskKey: string,
    filePath: string,
  ): Promise<AttachFileResponse[]> {
    if (!fs.existsSync(filePath)) {
      throw new HttpException(
        `File not found: ${filePath}`,
        HttpStatus.NOT_FOUND,
      );
    }

    const url = `${this.baseUrl}/rest/api/3/issue/${taskKey}/attachments`;

    const form = new FormData();
    const fileStream = fs.createReadStream(filePath);
    const filename = filePath.split('/').pop() || 'attachment';

    form.append('file', fileStream, {
      filename,
    });

    try {
      const response = await axios.post(url, form, {
        headers: {
          Authorization: this.auth,
          'X-Atlassian-Token': 'no-check',
          ...form.getHeaders(),
        },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          `Failed to attach file from path: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`,
          error.response.status,
        );
      }
      throw new HttpException(
        `Failed to attach file from path: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async attachFileFromBuffer(
    taskKey: string,
    buffer: Buffer,
    filename: string,
    mimeType?: string,
  ): Promise<AttachFileResponse[]> {
    const url = `${this.baseUrl}/rest/api/3/issue/${taskKey}/attachments`;

    const form = new FormData();
    form.append('file', buffer, {
      filename,
      contentType: mimeType || 'application/octet-stream',
    });

    try {
      const response = await axios.post(url, form, {
        headers: {
          Authorization: this.auth,
          'X-Atlassian-Token': 'no-check',
          ...form.getHeaders(),
        },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          `Failed to attach file from buffer: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`,
          error.response.status,
        );
      }
      throw new HttpException(
        `Failed to attach file from buffer: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
