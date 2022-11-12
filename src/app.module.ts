import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { CollectionsModule } from './collections/collections.module';

@Module({
  imports: [AuthModule, UsersModule, ConfigModule.forRoot(), CollectionsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
