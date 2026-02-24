import { Module } from '@nestjs/common';
import { StaysController } from './stays.controller';
import { StaysService } from './stays.service';
import { PropertyScopeModule } from '../property-scope/property-scope.module';

@Module({
  imports: [PropertyScopeModule],
  controllers: [StaysController],
  providers: [StaysService],
  exports: [StaysService],
})
export class StaysModule {}
