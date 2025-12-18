import { Module } from '@nestjs/common';
//modules
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './routes/auth/auth.module';
import { RecipeModule } from './routes/Recipe/recipe.module';
import { StorageModule } from './routes/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
    }),
    AuthModule,
    RecipeModule,
    StorageModule
  ],
})
export class AppModule {}
