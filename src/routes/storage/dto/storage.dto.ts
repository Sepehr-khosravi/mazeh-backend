import {IsString, IsNotEmpty, IsNumber } from "class-validator";


export class MaterialDto{
    @IsNotEmpty()
    @IsString()
    name : string;

    @IsNotEmpty()
    @IsString()
    type : string;

    @IsNumber()
    count : number;
}
