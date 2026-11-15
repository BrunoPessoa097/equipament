import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { RolesModule } from './roles/roles.module';
import { UserModule } from './user/user.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { EquipamentModule } from './equipament/equipament.module';
import { StorageModule } from './storage/storage.module';
import { StorageEquipUserModule } from './storage-equip-user/storage-equip-user.module';
import { AuthModule } from './auth/auth.module';
import { MetricsModule } from './metrics/metrics.module';
import { MetricsInterceptor } from './metrics/metrics/metrics.interceptor';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    RolesModule,
    UserModule,
    UserRolesModule,
    EquipamentModule,
    StorageModule,
    StorageEquipUserModule,
    AuthModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
