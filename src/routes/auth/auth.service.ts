import { Injectable} from "@nestjs/common";
//error handeler:
import {
  InternalServerErrorException ,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";

//providers
import { PrismaService } from "src/common/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

//dto
import {
  LoginDto, 
  RegisterDto,
  VerifyTokenDto
} from "./dto";

//auth Service:
@Injectable({})
export class AuthService{
  //services:
  constructor(
    private prismaService : PrismaService,
    private configService : ConfigService,
    private jwtService : JwtService
  ){};
  async login(dto : LoginDto){
    try{
      //checking is user exist?
      const user = await this.prismaService.user.findFirst({where : {email : dto.email}});
      if(!user){
        throw new NotFoundException("User Not Found, Please Try Again!");
      }
      //checking user password
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if(!isPasswordValid){
        throw new BadRequestException("Invalid Data, Please Try Again!");
      }
      //building token
      const token = await this.jwtService.signAsync({id : user.id, email : user.email}, {
        secret : this.configService.get("JWT_KEY")
      })
      if(!token) throw new InternalServerErrorException("Internal Server Error In Building Token!");
      //responsing
      return {
        message : "ok",
        data : {
          id : user.id,
          username : user.username,
          email : user.email,
          token : token
        }
      };
    }
    catch(e : any){
      if(e instanceof BadRequestException || e instanceof NotFoundException) return {
        message : e instanceof NotFoundException ? "Data Not Found, Please Try Again!" : "Invalid Data, PLease Try Again!"
      };
      console.log("Internal Server Error in login method from auth.service.ts : ", e);
      throw new InternalServerErrorException("Internal Server Error!");
    }
  }
  async register(dto: RegisterDto){
    try{
      //check is user exists?
      const user = await this.prismaService.user.findFirst({where : {email : dto.email}});
      if(user){
        throw new BadRequestException("Invalid Data, Please Try Again!")
      }
      //hashing password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(dto.password, salt);
      //creating a new User
      const newUser = await this.prismaService.user.create({
        data : {
          email : dto.email,
          username : dto.username,
          password : hash
        }
      });
      //building token :
      const token = await this.jwtService.signAsync({id : newUser.id, email : newUser.email}, {
        secret : this.configService.get("JWT_KEY")
      });
      if(!token) throw new InternalServerErrorException("Internal Server Error In Building Token!");
      //responsing
      return {
        message : "ok",
        data : {
            id : newUser.id,
            email : newUser.email,
            username : newUser.username,
            token : token
        }
      };
    }
    catch(e : any){
      if(e instanceof BadRequestException) return {
        message : "Invalid Data, PLease Try Again"
      };
      console.log("Internal Server Error in register method from auth.service.ts file! : ", e);
      throw new InternalServerErrorException("Internal Server Error!");
    }
  }
  //checking token
  async verifyTokens(data : VerifyTokenDto ){
    try{
      return {message : "ok", data : {
        id : data.id,
        email : data.email
      }};
    }
    catch(e : any){
      throw new InternalServerErrorException("Internal Server Error in verifyTokens method from auth.service.ts file!");
    }
  }
};