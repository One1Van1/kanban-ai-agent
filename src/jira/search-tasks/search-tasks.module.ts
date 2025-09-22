import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SearchTasksController } from './search-tasks.controller';
import { SearchTasksService } from './search-tasks.service';

@Module({
  imports: [ConfigModule],
  controllers: [SearchTasksController],
  providers: [SearchTasksService],
  exports: [SearchTasksService],
})
export class SearchTasksModule {}
