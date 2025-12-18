import { IsString, IsNumber, IsNotEmpty, isString, isNotEmpty } from "class-validator";


interface Step {
  order: number;
  description: string;
}
interface Ingrediant {
  name: string;
  amount: string;
}
interface Gallery {
  url: string;
}





//Recipes Dto
export class recipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  time: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  meal: string;

  gallery: Gallery[];
  ingrediants: Ingrediant[];
  steps: Step[];
}



export class deleteDto{
  @IsNotEmpty()
  @IsNumber()
  id : number;
}