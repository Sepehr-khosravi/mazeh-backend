import { Module } from "@nestjs/common";
//modules
import { JwtModule } from "@nestjs/jwt";



//config


import { ConfigService } from "@nestjs/config";
const config = new ConfigService;

//main provider
import { AuthGuard } from "./jwt-auth.guard";

//auth-guard module:
@Module({
  imports : [
    JwtModule.register({
        global : true,
        secret : config.get("JWT_KEY")
    }),
  ],
  providers : [
    AuthGuard
  ],
  exports : [
    AuthGuard
  ]
})
export class AuthGuardModule{};