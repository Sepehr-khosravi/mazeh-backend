import {
    Test,
    TestingModule
} from "@nestjs/testing";
import { RecipeController } from "./recipe.controller";
import { RecipeService } from "./recipe.service";
import {
    recipeDto, 
    deleteDto
} from "./dto";
import { AuthGuard } from "src/common/Guards/auth/jwt-auth.guard";
import { BadRequestException, NotFoundException } from "@nestjs/common";

let mockRecipeService ;

//test the findAll method of the Recipe Contorller;
describe("RecipeController - findAll", ()=>{
    let recipeController : RecipeController;
    let recipeService : RecipeService;

    beforeEach(async()=>{
        jest.clearAllMocks();

        mockRecipeService = {
            findAll : jest.fn(),
            addRecipe : jest.fn(),
            deleteRecipe : jest.fn()
        };


            const module : TestingModule = await Test.createTestingModule({
        controllers : [
            RecipeController
        ],
        providers : [
            {
                provide : RecipeService,
                useValue : mockRecipeService
            }
        ]
        }).overrideGuard(AuthGuard).useValue({canActivate : ()=> true}).compile();
        recipeController = module.get<RecipeController>(RecipeController);
        recipeService = module.get<RecipeService>(RecipeService);
    });

    it("should throw NotFound Error if there is not even just a Recipe ", async () =>{
        const error = new NotFoundException();
        mockRecipeService.findAll.mockRejectedValue(error);

        await expect(recipeController.findAll()).rejects.toThrow(error);

    })


    it("should return the findAll Result in the RecipeController", async () => {
        mockRecipeService.findAll.mockResolvedValue({
            message : "ok", 
            data : [{
            name : "Pasta",
            time : 900,
            category : "food",
            nationality : "italyan",
            difficulty : "normall",
            description : "Pasta is an easyer food for eating",
            meal : "dinner",
            gallery : [],
            ingrediants : [],
            steps : []
            }]
        });

        const result = await recipeController.findAll();

        expect(result).toMatchObject({
            message : "ok", 
            data : [{
            name : "Pasta",
            time : 900,
            category : "food",
            nationality : "italyan",
            difficulty : "normall",
            description : "Pasta is an easyer food for eating",
            meal : "dinner",
            gallery : [],
            ingrediants : [],
            steps : []
            }]
        });
    })

})


//test the addRecipe Function of the Recipe Controller .
describe("RecipeController - addRecipe", ()=> {
    //it's a dto for all of tests in "RecipeController - addRecipe"
    const dto: recipeDto = {
            name : "Pasta",
            time : 900,
            category : "food",
            nationality : "italyan",
            difficulty : "normall",
            description : "Pasta is an easyer food for eating",
            meal : "dinner",
            gallery : [],
            ingrediants : [],
            steps : []
    };


    let recipeController : RecipeController;
    let recipeService : RecipeService;
    beforeEach(async () => {
        jest.clearAllMocks();
        
        mockRecipeService = {
            findAll : jest.fn(),
            addRecipe : jest.fn(),
            deleteRecipe : jest.fn()
        };

        const module : TestingModule = await Test.createTestingModule({
            controllers : [RecipeController],
            providers : [
                {
                    provide : RecipeService,
                    useValue : mockRecipeService
                }
            ]
        }).overrideGuard(AuthGuard).useValue({
            canActivate: ()=> false,
        }).compile();

        recipeController = module.get<RecipeController>(RecipeController);
        recipeService = module.get<RecipeService>(RecipeService);
    });

    it("should call recipeService.addRecipe with correct dto", async () => {
        
        await recipeController.addRecipe(dto);

        expect(recipeService.addRecipe).toHaveBeenCalledWith(dto);
        
    });

    it("should throw BadRequest Error if a recipe was already existed" , async ()=>{
        
        const error = new BadRequestException();
        mockRecipeService.addRecipe.mockRejectedValue(error);

        expect(recipeService.addRecipe(dto)).rejects.toThrow(error);
    });


    it("should return the addRecipe result ", async ()=>{
        mockRecipeService.addRecipe.mockResolvedValue({message : "Recipe created" , data : {name : "pasta"}});
        
        const result = await recipeController.addRecipe(dto);

        expect(result).toMatchObject({message : "Recipe created", data : {name : "pasta"}});
    });

});

