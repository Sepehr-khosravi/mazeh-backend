import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";

//Error Handelers
import {
  NotFoundException
} from "@nestjs/common";


//dto
import {
  recipeDto
} from "./dto";


@Injectable()
export class RecipeService {
    constructor(
        private prismaService: PrismaService
    ) { };
    async findAll() {
        try {
            //getting all recipes
            const recipes = await this.prismaService.recipe.findMany();
            if (recipes.length === 0) {
                throw new NotFoundException("Recipes Not Found!");
            }
            return {
                message: "ok",
                data: recipes
            };
        }
        catch (e: any) {
            throw e;
        }
    }
    //it's not complete yet!
    async addRecipe(dto: recipeDto) {
      try {
        const exists = await this.prismaService.recipe.findFirst({
          where: {
            name: dto.name,
            category: dto.category,
            difficulty: dto.difficulty
          }
        });
  
        if (exists) throw new BadRequestException("Recipe already exists!");
  
        const newRecipe = await this.prismaService.recipe.create({
          data: {
            name: dto.name,
            time: dto.time,
            image: dto.gallery?.[0]?.url || "https://default.com/image.png",
            icon: dto.gallery?.[0]?.url || "https://default.com/icon.png",
            category: dto.category,
            nationality: dto.nationality,
            difficulty: dto.difficulty,
            meal: dto.meal,
            description: dto.description,
  
            gallery: {
              create: dto.gallery?.map(g => ({ url: g.url }))
            },
  
            ingredients: {
              create: dto.ingrediants?.map(i => ({
                name: i.name,
                amount: i.amount
              }))
            },
  
            steps: {
              create: dto.steps?.map(s => ({
                order: s.order,
                description: s.description
              }))
            }
          }
        });
  
        return { message: "Recipe created", data: newRecipe };
      } catch (e) {
        if (e instanceof BadRequestException) throw e;
        console.log("addRecipe error:", e);
        throw new InternalServerErrorException("Internal Server Error");
      }
    }
  
    //delete Recipe Method
  
    async deleteRecipe(recipeId: number) {
      try {
        //checking this recipe exists or doesn't !
        const findRecipe = await this.prismaService.recipe.findFirst({
          where: {
            id: recipeId
          }
        });
        if (!findRecipe) {
          throw new NotFoundException("This Recipe Not Found");
        }
        //deleting this recipe from db
        await this.prismaService.recipe.delete({
          where: {
            id: recipeId
          }
        });
  
        //responsing
        return {
          message: "Ok",
        }
      }
      catch (e: any) {
        if (e instanceof NotFoundException) throw e;
        console.log("deleteRecipe Error in RecipeService Class from the recipe.service.ts");
        throw new InternalServerErrorException("Internal Server Exception!");
      }
    }
  
  
  
};