import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttachFileController } from './attach-file.controller';
import { AttachFileService } from './attach-file.service';
import jiraConfig from '../../../config/jira.config';

@Module({
  imports: [ConfigModule.forFeature(jiraConfig)],
  controllers: [AttachFileController],
  providers: [AttachFileService],
  exports: [AttachFileService],
})
export class AttachFileModule {}
