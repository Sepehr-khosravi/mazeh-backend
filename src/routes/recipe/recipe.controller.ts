import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Delete,
    Version
} from "@nestjs/common";

//provider
import { RecipeService } from "./recipe.service";

//auth guard
import { AuthGuard } from "src/common/guards/auth/jwt-auth.guard";

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
    @Version("1")
    @Get() //route /recipe (Get Method)
    findAll(){
        return this.recipeService.findAll();
    }
    
    @Version("1")
    @Post("add") // route : /recipe/add (Post method!)
    //for adding a new recipe
    addRecipe(@Body() dto : recipeDto){
        return this.recipeService.addRecipe(dto);
    }

    @Version("1")
    @Delete("delete")// route : /recipe/delete (Delete method!)
    //for deleting a special recipe
    deleteRecipe(@Body() dto : deleteDto){
        return this.recipeService.deleteRecipe(dto.id);
    }

};