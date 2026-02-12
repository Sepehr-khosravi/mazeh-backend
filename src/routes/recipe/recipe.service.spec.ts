import { Test, TestingModule } from "@nestjs/testing";
import { RecipeService } from "./recipe.service";
import { NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { AuthGuard } from "src/common/guards/auth/jwt-auth.guard";

let mockPrisma = {
    recipe: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        delete: jest.fn()
    }
};

describe("RecipeService", () => {
    let recipeService: RecipeService;
    let prismaService: typeof mockPrisma;

    beforeEach(async () => {
        jest.clearAllMocks();
        
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RecipeService,
                {
                    provide: PrismaService,
                    useValue: mockPrisma
                }
            ]
        }).overrideGuard(AuthGuard).useValue({ canActivate: () => true }).compile();

        recipeService = module.get<RecipeService>(RecipeService);
        prismaService = module.get(PrismaService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("findAll", () => {
        it("should throw NotFoundException if no recipes exist", async () => {
            mockPrisma.recipe.findMany.mockResolvedValue([]);

            await expect(recipeService.findAll()).rejects.toThrow(NotFoundException);
            expect(mockPrisma.recipe.findMany).toHaveBeenCalledTimes(1);
        });

        it("should return recipes if they exist", async () => {
            const mockRecipes = [
                { name: "Pasta", id: 1, category: "Italian" },
                { name: "Pizza", id: 2, category: "Italian" }
            ];
            mockPrisma.recipe.findMany.mockResolvedValue(mockRecipes);

            const result = await recipeService.findAll();

            expect(result).toEqual({
                message: "ok",
                data: mockRecipes
            });
            expect(mockPrisma.recipe.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe("addRecipe", () => {
        const mockDto = {
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

        it("should create a new recipe successfully", async () => {
            mockPrisma.recipe.findFirst.mockResolvedValue(null);
            
            const mockCreatedRecipe = {
                id: 1,
                ...mockDto,
                image: mockDto.gallery[0].url,
                icon: mockDto.gallery[0].url
            };
            mockPrisma.recipe.create.mockResolvedValue(mockCreatedRecipe);

            const result = await recipeService.addRecipe(mockDto);

            expect(result).toEqual({
                message: "Recipe created",
                data: mockCreatedRecipe
            });
            expect(mockPrisma.recipe.findFirst).toHaveBeenCalledWith({
                where: {
                    name: mockDto.name,
                    category: mockDto.category,
                    difficulty: mockDto.difficulty
                }
            });
            expect(mockPrisma.recipe.create).toHaveBeenCalledTimes(1);
        });

        it("should throw BadRequestException if recipe already exists", async () => {
            mockPrisma.recipe.findFirst.mockResolvedValue({ id: 1, name: mockDto.name });

            await expect(recipeService.addRecipe(mockDto)).rejects.toThrow(BadRequestException);
            expect(mockPrisma.recipe.findFirst).toHaveBeenCalled();
            expect(mockPrisma.recipe.create).not.toHaveBeenCalled();
        });

        it("should use default image URL if gallery is not provided", async () => {
            const dtoWithoutGallery = {
                ...mockDto,
                gallery: []
            };
            
            mockPrisma.recipe.findFirst.mockResolvedValue(null);
            mockPrisma.recipe.create.mockResolvedValue({ id: 1, ...dtoWithoutGallery });

            await recipeService.addRecipe(dtoWithoutGallery);

            expect(mockPrisma.recipe.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    image: "https://default.com/image.png",
                    icon: "https://default.com/icon.png"
                })
            });
        });

        it("should handle empty arrays for relations", async () => {
            const dtoWithoutRelations = {
                ...mockDto,
                gallery: [],
                ingrediants: [],
                steps: []
            };

            mockPrisma.recipe.findFirst.mockResolvedValue(null);
            mockPrisma.recipe.create.mockResolvedValue({ id: 1 });

            await recipeService.addRecipe(dtoWithoutRelations);

            expect(mockPrisma.recipe.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    gallery: { create: [] },
                    ingredients: { create: [] },
                    steps: { create: [] }
                })
            });
        });

        it("should handle missing gallery property", async () => {
            const { gallery, ...dtoWithoutGalleryProp } = mockDto;
            
            mockPrisma.recipe.findFirst.mockResolvedValue(null);
            mockPrisma.recipe.create.mockResolvedValue({ id: 1 });

            await recipeService.addRecipe(dtoWithoutGalleryProp as any);

            expect(mockPrisma.recipe.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    image: "https://default.com/image.png",
                    icon: "https://default.com/icon.png"
                })
            });
        });

        it("should throw InternalServerErrorException for unexpected errors", async () => {
            mockPrisma.recipe.findFirst.mockRejectedValue(new Error("DB Error"));

            await expect(recipeService.addRecipe(mockDto)).rejects.toThrow(InternalServerErrorException);
            expect(mockPrisma.recipe.create).not.toHaveBeenCalled();
        });

        it("should verify create method is called with correct structure", async () => {
            mockPrisma.recipe.findFirst.mockResolvedValue(null);
            mockPrisma.recipe.create.mockResolvedValue({ id: 1 });

            await recipeService.addRecipe(mockDto);

            expect(mockPrisma.recipe.create).toHaveBeenCalledWith({
                data: {
                    name: mockDto.name,
                    time: mockDto.time,
                    image: mockDto.gallery[0].url,
                    icon: mockDto.gallery[0].url,
                    category: mockDto.category,
                    nationality: mockDto.nationality,
                    difficulty: mockDto.difficulty,
                    meal: mockDto.meal,
                    description: mockDto.description,
                    gallery: {
                        create: [{ url: mockDto.gallery[0].url }]
                    },
                    ingredients: {
                        create: mockDto.ingrediants.map(i => ({
                            name: i.name,
                            amount: i.amount
                        }))
                    },
                    steps: {
                        create: mockDto.steps.map(s => ({
                            order: s.order,
                            description: s.description
                        }))
                    }
                }
            });
        });
    });

    describe("deleteRecipe", () => {
        const recipeId = 1;

        it("should delete recipe successfully", async () => {
            mockPrisma.recipe.findFirst.mockResolvedValue({ id: recipeId, name: "Pasta" });
            mockPrisma.recipe.delete.mockResolvedValue({ id: recipeId });

            const result = await recipeService.deleteRecipe(recipeId);

            expect(result).toEqual({ message: "Ok" });
            expect(mockPrisma.recipe.findFirst).toHaveBeenCalledWith({
                where: { id: recipeId }
            });
            expect(mockPrisma.recipe.delete).toHaveBeenCalledWith({
                where: { id: recipeId }
            });
            expect(mockPrisma.recipe.delete).toHaveBeenCalledTimes(1);
        });

        it("should throw NotFoundException if recipe does not exist", async () => {
            mockPrisma.recipe.findFirst.mockResolvedValue(null);

            await expect(recipeService.deleteRecipe(recipeId)).rejects.toThrow(NotFoundException);
            expect(mockPrisma.recipe.findFirst).toHaveBeenCalledWith({
                where: { id: recipeId }
            });
            expect(mockPrisma.recipe.delete).not.toHaveBeenCalled();
        });

        it("should throw InternalServerErrorException for unexpected errors during findFirst", async () => {
            mockPrisma.recipe.findFirst.mockRejectedValue(new Error("DB Error"));

            await expect(recipeService.deleteRecipe(recipeId)).rejects.toThrow(InternalServerErrorException);
            expect(mockPrisma.recipe.delete).not.toHaveBeenCalled();
        });

        it("should throw InternalServerErrorException for unexpected errors during delete", async () => {
            mockPrisma.recipe.findFirst.mockResolvedValue({ id: recipeId });
            mockPrisma.recipe.delete.mockRejectedValue(new Error("Delete Error"));

            await expect(recipeService.deleteRecipe(recipeId)).rejects.toThrow(InternalServerErrorException);
            expect(mockPrisma.recipe.findFirst).toHaveBeenCalled();
            expect(mockPrisma.recipe.delete).toHaveBeenCalled();
        });

        it("should handle numeric string recipeId", async () => {
            const stringId = "1";
            mockPrisma.recipe.findFirst.mockResolvedValue({ id: 1 });
            mockPrisma.recipe.delete.mockResolvedValue({ id: 1 });

            // @ts-ignore - testing string input
            const result = await recipeService.deleteRecipe(stringId);

            expect(result).toEqual({ message: "Ok" });
            expect(mockPrisma.recipe.findFirst).toHaveBeenCalledWith({
                where: { id: stringId }
            });
        });

    });

    describe("Error Handling", () => {
        it("should propagate BadRequestException from addRecipe", async () => {
            mockPrisma.recipe.findFirst.mockResolvedValue({ id: 1 });

            await expect(recipeService.addRecipe({} as any)).rejects.toThrow(BadRequestException);
        });

        it("should propagate NotFoundException from deleteRecipe", async () => {
            mockPrisma.recipe.findFirst.mockResolvedValue(null);

            await expect(recipeService.deleteRecipe(999)).rejects.toThrow(NotFoundException);
        });

        it("should handle unknown error types in catch blocks", async () => {
            mockPrisma.recipe.findFirst.mockRejectedValue("String error"); // not an Error object
            
            await expect(recipeService.deleteRecipe(1)).rejects.toThrow(InternalServerErrorException);
        });
    });
});