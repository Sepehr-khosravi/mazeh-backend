import { IsEmail, IsString, MinLength, IsNotEmpty, isNotEmpty } from "class-validator";

export class LoginDto{
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email : string;
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password : string;
}

export class RegisterDto{
    @IsNotEmpty()
    @IsString()
    username : string;
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email : string;
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password : string;
}

export class VerifyTokenDto{
    @IsNotEmpty()
    @IsString()
    id : number;
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email : string;
}