import { Module } from '@nestjs/common';
import { ManagerPropertiesController } from './manager-properties.controller';
import { ManagerPropertiesService } from './manager-properties.service';

@Module({
  controllers: [ManagerPropertiesController],
  providers: [ManagerPropertiesService],
  exports: [ManagerPropertiesService],
})
export class ManagerPropertiesModule {}
