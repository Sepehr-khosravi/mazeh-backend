import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Delete
} from "@nestjs/common";

//provider
import { RecipeService } from "./recipe.service";

//auth guard
import { AuthGuard } from "src/common/Guards/auth/jwt-auth.guard";


//dto
import {
    recipeDto,
    deleteDto
} from "./dto";


@UseGuards(AuthGuard)
@Controller("recipe")
export class RecipeController{
    constructor(
        private recipeService : RecipeService
    ){};
    //for getting List of Recipes
    @Get() //route /recipe (Get Method)
    findAll(){
        return this.recipeService.findAll();
    }
    
    @Post("add") // route : /recipe/add (Post method!)
    //for adding a new recipe
    addRecipe(@Body() dto : recipeDto){
        return this.recipeService.addRecipe(dto);
    }

    @Delete("delete")// route : /recipe/delete (Delete method!)
    //for deleting a special recipe
    deleteRecipe(@Body() dto : deleteDto){
        return this.recipeService.deleteRecipe(dto.id);
    }

};