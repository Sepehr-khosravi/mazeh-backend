import {IsString, IsNotEmpty, IsNumber } from "class-validator";


export class MaterialDto{
    @IsNotEmpty()
    @IsString()
    name : string;
}

export class IdDto{
    @IsNotEmpty()
    @IsNumber()
    id : number;
}