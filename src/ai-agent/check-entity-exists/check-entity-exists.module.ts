import { Module } from '@nestjs/common';
import { CheckEntityExistsController } from './check-entity-exists.controller';
import { CheckEntityExistsService } from './check-entity-exists.service';

@Module({
  controllers: [CheckEntityExistsController],
  providers: [CheckEntityExistsService],
  exports: [CheckEntityExistsService],
})
export class CheckEntityExistsModule {}
