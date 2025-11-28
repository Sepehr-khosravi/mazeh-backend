import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req
} from "@nestjs/common";

//provider
import { AuthService } from "./auth.service";


//authGuard
import { AuthGuard } from "src/common/Guards/auth/jwt-auth.guard";

//dto
import {
  LoginDto, 
  RegisterDto
} from "./dto";
//auth controller in /auth route:
@Controller("auth")
export class AuthController{
  //provder:
  constructor(
    private authService : AuthService,
  ){}
  //login route /auth/login
  @Post("login")
  login(@Body() dto : LoginDto){
    return this.authService.login(dto)
  }
  //register route /auth/register
  @Post("register")
  register(@Body() dto : RegisterDto){
    return this.authService.register(dto);
  }
  //for checking token :
  @UseGuards(AuthGuard)
  //verify route /auth/verify
  @Get("verify")
  verifyToken(@Req() req){
    return this.authService.verifyTokens(req.user)
  }
}