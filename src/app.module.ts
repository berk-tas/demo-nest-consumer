import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RuntimeConfigModule } from './runtime-config/runtime-config.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RuntimeConfigModule],
})
export class AppModule {}
