import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

//modules
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from '../../common/prisma/prisma.module';
import { JwtModule } from "@nestjs/jwt";
import { AuthGuardModule } from "src/common/Guards/auth/jwt-auth.module";
//config 
import { ConfigService } from "@nestjs/config";
const config = new ConfigService;
//auth module:
@Module({
   imports : [
    ConfigModule,
    PrismaModule,
    JwtModule.register({
      global : true,
      secret : config.get("JWT_KEY")
    }),
    AuthGuardModule
   ],
   providers : [AuthService],
   controllers : [AuthController]
})
export class AuthModule{};