import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { StorageService } from "./storage.service";
import { PrismaService } from "src/common/prisma/prisma.service";
import { MaterialDto } from "./dto";

describe('StorageService', () => {
    let service: StorageService;
    let prismaService: PrismaService;

    const mockUserId = 1;
    const mockMaterialId = 123;
    
    const mockMaterialDto: MaterialDto = {
        name: 'Test Material',
        type: 'Test Type',
        count: 50
    };

    const mockMaterial = {
        id: mockMaterialId,
        name: 'Test Material',
        type: 'Test Type',
        count: 100,
        userId: mockUserId
    };

    let mockPrismaService = {
        refrigerator: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StorageService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService
                }
            ],
        }).compile();

        service = module.get<StorageService>(StorageService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all materials for a user', async () => {
            const mockMaterials = [
                { id: 1, name: 'Material 1', type: 'Type 1', count: 10, userId: mockUserId },
                { id: 2, name: 'Material 2', type: 'Type 2', count: 20, userId: mockUserId }
            ];

            mockPrismaService.refrigerator.findMany.mockResolvedValue(mockMaterials);

            const result = await service.findAll(mockUserId);

            expect(prismaService.refrigerator.findMany).toHaveBeenCalledWith({
                where: { userId: mockUserId }
            });
            
            expect(result).toEqual({
                message: "ok",
                data: mockMaterials.map(m => ({
                    id: m.id,
                    name: m.name,
                    type: m.type,
                    count: m.count
                }))
            });
        });

        it('should return empty array when no materials found', async () => {
            mockPrismaService.refrigerator.findMany.mockResolvedValue([]);

            const result = await service.findAll(mockUserId);

            expect(result).toEqual({
                message: "ok",
                data: []
            });
        });

        it('should throw InternalServerErrorException on database error', async () => {
            mockPrismaService.refrigerator.findMany.mockRejectedValue(new Error('Database error'));

            await expect(service.findAll(mockUserId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('addNewMaterials', () => {
        const addMaterialData = {
            dto: mockMaterialDto,
            userId: mockUserId
        };

        it('should create new material successfully', async () => {
            mockPrismaService.refrigerator.findFirst.mockResolvedValue(null);
            
            const newMaterial = {
                id: 1,
                name: mockMaterialDto.name,
                type: mockMaterialDto.type,
                count: mockMaterialDto.count,
                userId: mockUserId
            };
            mockPrismaService.refrigerator.create.mockResolvedValue(newMaterial);

            const result = await service.addNewMaterials(addMaterialData);

            expect(prismaService.refrigerator.findFirst).toHaveBeenCalledWith({
                where: {
                    name: mockMaterialDto.name,
                    type: mockMaterialDto.type,
                    userId: mockUserId
                }
            });
            
            expect(prismaService.refrigerator.create).toHaveBeenCalledWith({
                data: {
                    name: mockMaterialDto.name,
                    type: mockMaterialDto.type,
                    count: mockMaterialDto.count,
                    userId: mockUserId
                }
            });

            expect(result).toEqual({
                message: "Created",
                data: {
                    id: newMaterial.id,
                    name: newMaterial.name,
                    type: newMaterial.type,
                    count: newMaterial.count
                }
            });
        });

        it('should throw BadRequestException if material already exists', async () => {
            mockPrismaService.refrigerator.findFirst.mockResolvedValue(mockMaterial);

            await expect(service.addNewMaterials(addMaterialData)).rejects.toThrow(BadRequestException);
            expect(prismaService.refrigerator.create).not.toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException on database error', async () => {
            mockPrismaService.refrigerator.findFirst.mockRejectedValue(new Error('Database error'));

            await expect(service.addNewMaterials(addMaterialData)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('plusAmount', () => {
        it('should increase material count by 100', async () => {
            mockPrismaService.refrigerator.findFirst.mockResolvedValue(mockMaterial);
            
            const updatedMaterial = {
                ...mockMaterial,
                count: mockMaterial.count + 100
            };
            mockPrismaService.refrigerator.update.mockResolvedValue(updatedMaterial);

            const result = await service.plusAmount(mockMaterialId);

            expect(prismaService.refrigerator.findFirst).toHaveBeenCalledWith({
                where: { id: mockMaterialId }
            });

            expect(prismaService.refrigerator.update).toHaveBeenCalledWith({
                where: { id: mockMaterialId },
                data: {
                    count: mockMaterial.count + 100
                }
            });

            expect(result).toEqual({
                message: "Ok",
                data: {
                    id: updatedMaterial.id,
                    name: updatedMaterial.name,
                    type: updatedMaterial.type,
                    count: updatedMaterial.count
                }
            });
        });

        it('should throw NotFoundException if material does not exist', async () => {
            mockPrismaService.refrigerator.findFirst.mockResolvedValue(null);

            await expect(service.plusAmount(mockMaterialId)).rejects.toThrow(NotFoundException);
            expect(prismaService.refrigerator.update).not.toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException on database error', async () => {
            mockPrismaService.refrigerator.findFirst.mockRejectedValue(new Error('Database error'));

            await expect(service.plusAmount(mockMaterialId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('minesAmount', () => {
        it('should decrease material count by 100 when sufficient count exists', async () => {
            const materialWithSufficientCount = {
                ...mockMaterial,
                count: 150
            };
            
            mockPrismaService.refrigerator.findFirst.mockResolvedValue(materialWithSufficientCount);
            
            const updatedMaterial = {
                ...materialWithSufficientCount,
                count: 50
            };
            mockPrismaService.refrigerator.update.mockResolvedValue(updatedMaterial);

            const result = await service.minesAmount(mockMaterialId);

            expect(prismaService.refrigerator.update).toHaveBeenCalledWith({
                where: { id: mockMaterialId },
                data: {
                    count: materialWithSufficientCount.count - 100
                }
            });

            expect(result).toEqual({
                message: "Ok",
                data: {
                    id: updatedMaterial.id,
                    name: updatedMaterial.name,
                    type: updatedMaterial.type,
                    count: updatedMaterial.count
                }
            });
        });

        it('should throw NotFoundException if material does not exist', async () => {
            mockPrismaService.refrigerator.findFirst.mockResolvedValue(null);

            await expect(service.minesAmount(mockMaterialId)).rejects.toThrow(NotFoundException);
            expect(prismaService.refrigerator.update).not.toHaveBeenCalled();
        });

        it('should throw BadRequestException if insufficient count', async () => {
            const materialWithInsufficientCount = {
                ...mockMaterial,
                count: 50
            };
            
            mockPrismaService.refrigerator.findFirst.mockResolvedValue(materialWithInsufficientCount);

            await expect(service.minesAmount(mockMaterialId)).rejects.toThrow(BadRequestException);
            expect(prismaService.refrigerator.update).not.toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException on database error', async () => {
            mockPrismaService.refrigerator.findFirst.mockRejectedValue(new Error('Database error'));

            await expect(service.minesAmount(mockMaterialId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('deleteMaterials', () => {
        const deleteDto = {
            id: mockMaterialId,
            userId: mockUserId
        };

        it('should delete material successfully', async () => {
            mockPrismaService.refrigerator.findFirst.mockResolvedValue(mockMaterial);
            mockPrismaService.refrigerator.delete.mockResolvedValue(mockMaterial);

            const result = await service.deleteMaterials(deleteDto);

            expect(prismaService.refrigerator.findFirst).toHaveBeenCalledWith({
                where: {
                    id: mockMaterialId,
                    userId: mockUserId
                }
            });

            expect(prismaService.refrigerator.delete).toHaveBeenCalledWith({
                where: {
                    id: mockMaterialId,
                    userId: mockUserId
                }
            });

            expect(result).toEqual({
                message: "Ok",
                data: {
                    id: mockMaterial.id,
                    name: mockMaterial.name,
                    type: mockMaterial.type,
                    count: mockMaterial.count,
                    deleted: true
                }
            });
        });

        it('should throw NotFoundException if material does not exist', async () => {
            mockPrismaService.refrigerator.findFirst.mockResolvedValue(null);

            await expect(service.deleteMaterials(deleteDto)).rejects.toThrow(NotFoundException);
            expect(prismaService.refrigerator.delete).not.toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException on database error in findFirst', async () => {
            mockPrismaService.refrigerator.findFirst.mockRejectedValue(new Error('Database error'));

            await expect(service.deleteMaterials(deleteDto)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException on delete error', async () => {
            mockPrismaService.refrigerator.findFirst.mockResolvedValue(mockMaterial);
            mockPrismaService.refrigerator.delete.mockRejectedValue(new Error('Delete failed'));

            await expect(service.deleteMaterials(deleteDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('Edge Cases', () => {
        it('should handle zero count in plusAmount', async () => {
            const zeroCountMaterial = {
                ...mockMaterial,
                count: 0
            };
            
            mockPrismaService.refrigerator.findFirst.mockResolvedValue(zeroCountMaterial);
            
            const updatedMaterial = {
                ...zeroCountMaterial,
                count: 100
            };
            mockPrismaService.refrigerator.update.mockResolvedValue(updatedMaterial);

            const result = await service.plusAmount(mockMaterialId);
            expect(result.data.count).toBe(100);
        });

        it('should handle exact 100 count in minesAmount', async () => {
            const exactCountMaterial = {
                ...mockMaterial,
                count: 100
            };
            
            mockPrismaService.refrigerator.findFirst.mockResolvedValue(exactCountMaterial);
            
            const updatedMaterial = {
                ...exactCountMaterial,
                count: 0
            };
            mockPrismaService.refrigerator.update.mockResolvedValue(updatedMaterial);

            const result = await service.minesAmount(mockMaterialId);
            expect(result.data.count).toBe(0);
        });
    });
});