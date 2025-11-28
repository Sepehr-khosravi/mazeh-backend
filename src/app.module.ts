import { Module } from '@nestjs/common';
//modules
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './routes/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
