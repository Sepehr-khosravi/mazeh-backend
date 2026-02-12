import { Injectable } from "@nestjs/common";
// for creating a Gaurd
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from "@nestjs/common";
//providers
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(
    private jwtService : JwtService,
    private configService : ConfigService    
  ){};
  canActivate(context: ExecutionContext): boolean{

      //getting request from context.
      const request = context.switchToHttp().getRequest();
      //getting authHeader "Authorization" 
      const authHeader = request.headers["authorization"];
      if(!authHeader) throw new UnauthorizedException();
;
      //getting token from authHeader
      const token = authHeader.replace("Bearer ", "");
      if(!token) return false;

      try {
      //decoding the token:
      const decode = this.jwtService.verify(token, {
        secret : this.configService.get("JWT_KEY")
      });
      request.user = {
        id : decode.id,
        email : decode.email
      };
      
      return true;
    }
    catch(e : any){
          console.error("Error in AuthGuard from jwt-auth.guard.ts file.!");
          throw new UnauthorizedException();
    }
    }
};