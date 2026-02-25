import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ManagerPropertiesModule } from './modules/manager-properties/manager-properties.module';
import { PropertyScopeModule } from './modules/property-scope/property-scope.module';
import { OwnersModule } from './modules/owners/owners.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { JwtAuthGuard, RolesGuard } from './modules/common/guards';
import { StaysModule } from './modules/stays/stays.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { PayoutsModule } from './modules/payouts/payouts.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ManagerPropertiesModule,
    PropertyScopeModule,
    OwnersModule,
    PropertiesModule,
    StaysModule,
    TransactionsModule,
    PayoutsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
