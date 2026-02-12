import { Test, TestingModule } from "@nestjs/testing";
import { RecipeController } from "./recipe.controller";
import { RecipeService } from "./recipe.service";
import { AuthGuard } from "src/common/guards/auth/jwt-auth.guard";
import { NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { recipeDto, deleteDto } from "./dto";

describe("RecipeController", () => {
    let recipeController: RecipeController;
    let recipeService: RecipeService;

    const mockRecipeService = {
        findAll: jest.fn(),
        addRecipe: jest.fn(),
        deleteRecipe: jest.fn()
    };

    const mockAuthGuard = {
        canActivate: jest.fn(() => true)
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});

        const module: TestingModule = await Test.createTestingModule({
            controllers: [RecipeController],
            providers: [
                {
                    provide: RecipeService,
                    useValue: mockRecipeService
                }
            ]
        })
            .overrideGuard(AuthGuard)
            .useValue(mockAuthGuard)
            .compile();

        recipeController = module.get<RecipeController>(RecipeController);
        recipeService = module.get<RecipeService>(RecipeService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("findAll", () => {
        it("should call recipeService.findAll and return result", async () => {
            const expectedResult = {
                message: "ok",
                data: [{ id: 1, name: "Pasta" }]
            };
            mockRecipeService.findAll.mockResolvedValue(expectedResult);

            const result = await recipeController.findAll();

            expect(result).toEqual(expectedResult);
            expect(mockRecipeService.findAll).toHaveBeenCalledTimes(1);
            expect(mockRecipeService.findAll).toHaveBeenCalledWith();
        });

        it("should throw NotFoundException when no recipes found", async () => {
            mockRecipeService.findAll.mockRejectedValue(new NotFoundException("Recipes Not Found!"));

            await expect(recipeController.findAll()).rejects.toThrow(NotFoundException);
            expect(mockRecipeService.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe("addRecipe", () => {
        const mockRecipeDto: recipeDto = {
            name: "Pasta Carbonara",
            time: 30,
            gallery: [{ url: "https://example.com/pasta.jpg" }],
            category: "Italian",
            nationality: "Italian",
            difficulty: "Medium",
            meal: "Dinner",
            description: "Delicious pasta",
            ingrediants: [
                { name: "Pasta", amount: "200g" },
                { name: "Eggs", amount: "2" }
            ],
            steps: [
                { order: 1, description: "Boil water" },
                { order: 2, description: "Cook pasta" }
            ]
        };

        it("should call recipeService.addRecipe with dto and return result", async () => {
            const expectedResult = {
                message: "Recipe created",
                data: { id: 1, ...mockRecipeDto }
            };
            mockRecipeService.addRecipe.mockResolvedValue(expectedResult);

            const result = await recipeController.addRecipe(mockRecipeDto);

            expect(result).toEqual(expectedResult);
            expect(mockRecipeService.addRecipe).toHaveBeenCalledTimes(1);
            expect(mockRecipeService.addRecipe).toHaveBeenCalledWith(mockRecipeDto);
        });

        it("should throw BadRequestException when recipe already exists", async () => {
            mockRecipeService.addRecipe.mockRejectedValue(new BadRequestException("Recipe already exists!"));

            await expect(recipeController.addRecipe(mockRecipeDto)).rejects.toThrow(BadRequestException);
            expect(mockRecipeService.addRecipe).toHaveBeenCalledWith(mockRecipeDto);
        });

        it("should throw InternalServerErrorException for unexpected errors", async () => {
            mockRecipeService.addRecipe.mockRejectedValue(new InternalServerErrorException());

            await expect(recipeController.addRecipe(mockRecipeDto)).rejects.toThrow(InternalServerErrorException);
            expect(mockRecipeService.addRecipe).toHaveBeenCalledWith(mockRecipeDto);
        });

        it("should handle empty gallery array", async () => {
            const dtoWithoutGallery = {
                ...mockRecipeDto,
                gallery: []
            };
            
            mockRecipeService.addRecipe.mockResolvedValue({ message: "Recipe created", data: { id: 1 } });

            await recipeController.addRecipe(dtoWithoutGallery);

            expect(mockRecipeService.addRecipe).toHaveBeenCalledWith(dtoWithoutGallery);
        });

        it("should handle missing optional fields", async () => {
            const minimalDto: recipeDto = {
                name: "Simple Pasta",
                time: 20,
                category: "Italian",
                nationality: "Italian",
                difficulty: "Easy",
                meal: "Lunch",
                description: "Simple recipe",
                gallery: [],
                ingrediants: [],
                steps: []
            };

            mockRecipeService.addRecipe.mockResolvedValue({ message: "Recipe created", data: { id: 1 } });

            await recipeController.addRecipe(minimalDto);

            expect(mockRecipeService.addRecipe).toHaveBeenCalledWith(minimalDto);
        });
    });

    describe("deleteRecipe", () => {
        const mockDeleteDto: deleteDto = {
            id: 1
        };

        it("should call recipeService.deleteRecipe with id and return result", async () => {
            const expectedResult = { message: "Ok" };
            mockRecipeService.deleteRecipe.mockResolvedValue(expectedResult);

            const result = await recipeController.deleteRecipe(mockDeleteDto);

            expect(result).toEqual(expectedResult);
            expect(mockRecipeService.deleteRecipe).toHaveBeenCalledTimes(1);
            expect(mockRecipeService.deleteRecipe).toHaveBeenCalledWith(mockDeleteDto.id);
        });

        it("should throw NotFoundException when recipe doesn't exist", async () => {
            mockRecipeService.deleteRecipe.mockRejectedValue(new NotFoundException("This Recipe Not Found"));

            await expect(recipeController.deleteRecipe(mockDeleteDto)).rejects.toThrow(NotFoundException);
            expect(mockRecipeService.deleteRecipe).toHaveBeenCalledWith(mockDeleteDto.id);
        });

        it("should throw InternalServerErrorException for unexpected errors", async () => {
            mockRecipeService.deleteRecipe.mockRejectedValue(new InternalServerErrorException());

            await expect(recipeController.deleteRecipe(mockDeleteDto)).rejects.toThrow(InternalServerErrorException);
            expect(mockRecipeService.deleteRecipe).toHaveBeenCalledWith(mockDeleteDto.id);
        });

        it("should handle different id values", async () => {
            const deleteDtoWithStringId: deleteDto = {
                id: "123" as any 
            };
            
            mockRecipeService.deleteRecipe.mockResolvedValue({ message: "Ok" });

            await recipeController.deleteRecipe(deleteDtoWithStringId);

            expect(mockRecipeService.deleteRecipe).toHaveBeenCalledWith(deleteDtoWithStringId.id);
        });
    });

    describe("Guard and Versioning", () => {
        it("should have AuthGuard applied to controller", () => {
            const guards = Reflect.getMetadata("__guards__", RecipeController);
            expect(guards).toBeDefined();
            expect(guards[0].name).toBe("AuthGuard");
        });

        it("should have version 1 on findAll method", () => {
            const version = Reflect.getMetadata("__version__", RecipeController.prototype.findAll);
            expect(version).toBe("1");
        });

        it("should have version 1 on addRecipe method", () => {
            const version = Reflect.getMetadata("__version__", RecipeController.prototype.addRecipe);
            expect(version).toBe("1");
        });

        it("should have version 1 on deleteRecipe method", () => {
            const version = Reflect.getMetadata("__version__", RecipeController.prototype.deleteRecipe);
            expect(version).toBe("1");
        });

        it("should have GET decorator on findAll", () => {
            const route = Reflect.getMetadata("path", RecipeController.prototype.findAll);
            const method = Reflect.getMetadata("method", RecipeController.prototype.findAll);
            expect(route).toBe("/");
            expect(method).toBe(0); // 0(GET)
        });

        it("should have POST decorator on addRecipe", () => {
            const route = Reflect.getMetadata("path", RecipeController.prototype.addRecipe);
            const method = Reflect.getMetadata("method", RecipeController.prototype.addRecipe);
            expect(route).toBe("add");
            expect(method).toBe(1); // 1(POST)
        });

        it("should have DELETE decorator on deleteRecipe", () => {
            const route = Reflect.getMetadata("path", RecipeController.prototype.deleteRecipe);
            const method = Reflect.getMetadata("method", RecipeController.prototype.deleteRecipe);
            expect(route).toBe("delete");
            expect(method).toBe(3); // 3(DELETE)
        });
    });

    describe("Integration", () => {
        it("should handle complete flow: findAll -> addRecipe -> deleteRecipe", async () => {
            mockRecipeService.findAll.mockRejectedValue(new NotFoundException());
            await expect(recipeController.findAll()).rejects.toThrow(NotFoundException);

            const newRecipe = {
                name: "Pizza",
                time: 20,
                category: "Italian",
                nationality: "Italian",
                difficulty: "Easy",
                meal: "Dinner",
                description: "Delicious pizza",
                gallery: [{ url: "pizza.jpg" }],
                ingrediants: [{ name: "Dough", amount: "200g" }],
                steps: [{ order: 1, description: "Bake" }]
            };
            
            const addResult = { 
                message: "Recipe created", 
                data: { id: 1, ...newRecipe } 
            };
            mockRecipeService.addRecipe.mockResolvedValue(addResult);
            
            const addResponse = await recipeController.addRecipe(newRecipe);
            expect(addResponse).toEqual(addResult);

            const findAllResult = { 
                message: "ok", 
                data: [{ id: 1, ...newRecipe }] 
            };
            mockRecipeService.findAll.mockResolvedValue(findAllResult);
            
            const findAllResponse = await recipeController.findAll();
            expect(findAllResponse).toEqual(findAllResult);

            
            const deleteResult = { message: "Ok" };
            mockRecipeService.deleteRecipe.mockResolvedValue(deleteResult);
            
            const deleteResponse = await recipeController.deleteRecipe({ id: 1 });
            expect(deleteResponse).toEqual(deleteResult);
        });
    });
});