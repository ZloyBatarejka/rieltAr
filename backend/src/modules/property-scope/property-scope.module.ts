import { Module } from '@nestjs/common';
import { PropertyScopeService } from './property-scope.service';
import { ManagerPropertiesModule } from '../manager-properties/manager-properties.module';

@Module({
  imports: [ManagerPropertiesModule],
  providers: [PropertyScopeService],
  exports: [PropertyScopeService],
})
export class PropertyScopeModule {}
