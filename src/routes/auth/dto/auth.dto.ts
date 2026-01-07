import { IsEmail, IsString, MinLength, IsNotEmpty, isNotEmpty, IsOptional } from "class-validator";
import { AtLeastOne } from "src/common/decorators/validators/at-least-one.decorator";
export class LoginDto {
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;
    @IsOptional()
    @IsString()
    username?: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    @AtLeastOne(["email", "username"], {
        message : "خداثل یکی از اینا باید وارد شود username یا email."
    })
    _atLeastOneCheck: boolean;
}

export class RegisterDto {
    @IsOptional()
    @IsString()
    username?: string;
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    
    @AtLeastOne(["email", "username"], {
        message : "خداثل یکی از اینا باید وارد شود username یا email."
    })
    _atLeastOneCheck: boolean;
}

export class VerifyTokenDto {
    @IsNotEmpty()
    @IsString()
    id: number;
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}