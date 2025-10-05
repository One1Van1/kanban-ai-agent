import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Controllers
import { ConfigureContextSourcesController } from '../features/context-management/configure-context-sources/configure-context-sources.controller';

// Services
import { ConfigureContextSourcesService } from '../features/context-management/configure-context-sources/configure-context-sources.service';

@Module({
  imports: [ConfigModule],
  controllers: [ConfigureContextSourcesController],
  providers: [ConfigureContextSourcesService],
  exports: [ConfigureContextSourcesService],
})
export class ContextManagementModule {}
