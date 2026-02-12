import {
    Test,
    TestingModule
} from "@nestjs/testing";

import { StorageController } from "./storage.controller";
import { StorageService } from "./storage.service";
import { PrismaService } from "src/common/prisma/prisma.service";
import { AuthGuard } from "src/common/guards/auth/jwt-auth.guard";
import { MaterialDto } from "./dto";

describe('StorageController', () => {
    let controller: StorageController;
    let storageService: StorageService;

    const mockUserId = 1;
    const mockMaterialId = 123;
    
    const mockRequest = {
        user: {
            id: mockUserId
        }
    };

    const mockMaterialDto: MaterialDto = {
        name: 'Test Material',
        type: 'type1',
        count: 10,
        // سایر فیلدهای مورد نیاز MaterialDto
    };

    let mockStorageService = {
        findAll: jest.fn(),
        addNewMaterials: jest.fn(),
        plusAmount: jest.fn(),
        minesAmount: jest.fn(),
        deleteMaterials: jest.fn()
    };

    let mockPrismaService = {};

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [StorageController],
            providers: [
                {
                    provide: StorageService,
                    useValue: mockStorageService
                },
                {
                    provide: PrismaService,
                    useValue: mockPrismaService
                }
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<StorageController>(StorageController);
        storageService = module.get<StorageService>(StorageService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should call storageService.findAll with userId', async () => {
            const expectedResult = [{ id: 1, name: 'Material 1' }];
            mockStorageService.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll(mockRequest);

            expect(mockStorageService.findAll).toHaveBeenCalledWith(mockUserId);
            expect(mockStorageService.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });

        it('should handle errors from storageService.findAll', async () => {
            const error = new Error('Database error');
            mockStorageService.findAll.mockRejectedValue(error);

            await expect(controller.findAll(mockRequest)).rejects.toThrow(error);
            expect(mockStorageService.findAll).toHaveBeenCalledWith(mockUserId);
        });
    });

    describe('addMaterials', () => {
        it('should call storageService.addNewMaterials with dto and userId', async () => {
            const expectedData = {
                dto: mockMaterialDto,
                userId: mockUserId
            };
            const expectedResult = { id: 1, ...mockMaterialDto };
            
            mockStorageService.addNewMaterials.mockResolvedValue(expectedResult);

            const result = await controller.addMaterials(mockMaterialDto, mockRequest);

            expect(mockStorageService.addNewMaterials).toHaveBeenCalledWith(expectedData);
            expect(mockStorageService.addNewMaterials).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });

        it('should handle errors from storageService.addNewMaterials', async () => {
            const error = new Error('Validation failed');
            mockStorageService.addNewMaterials.mockRejectedValue(error);

            await expect(controller.addMaterials(mockMaterialDto, mockRequest)).rejects.toThrow(error);
            expect(mockStorageService.addNewMaterials).toHaveBeenCalledWith({
                dto: mockMaterialDto,
                userId: mockUserId
            });
        });
    });

    describe('plusMeterialCount', () => {
        it('should call storageService.plusAmount with parsed id', async () => {
            const idParam = mockMaterialId.toString();
            const expectedResult = { id: mockMaterialId, count: 20 };
            
            mockStorageService.plusAmount.mockResolvedValue(expectedResult);

            const result = await controller.plusMeterialCount(idParam);

            expect(mockStorageService.plusAmount).toHaveBeenCalledWith(mockMaterialId);
            expect(mockStorageService.plusAmount).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });

        it('should handle NaN id parameter', async () => {
            const invalidId = 'invalid';
            const result = await controller.plusMeterialCount(invalidId);
            
            expect(mockStorageService.plusAmount).toHaveBeenCalledWith(NaN);
        });

        it('should handle errors from storageService.plusAmount', async () => {
            const error = new Error('Material not found');
            mockStorageService.plusAmount.mockRejectedValue(error);

            await expect(controller.plusMeterialCount(mockMaterialId.toString())).rejects.toThrow(error);
            expect(mockStorageService.plusAmount).toHaveBeenCalledWith(mockMaterialId);
        });
    });

    describe('minesMeterialCount', () => {
        it('should call storageService.minesAmount with parsed id', async () => {
            const idParam = mockMaterialId.toString();
            const expectedResult = { id: mockMaterialId, count: 5 };
            
            mockStorageService.minesAmount.mockResolvedValue(expectedResult);

            const result = await controller.minesMeterialCount(idParam);

            expect(mockStorageService.minesAmount).toHaveBeenCalledWith(mockMaterialId);
            expect(mockStorageService.minesAmount).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });

        it('should handle NaN id parameter', async () => {
            const invalidId = 'invalid';
            const result = await controller.minesMeterialCount(invalidId);
            
            expect(mockStorageService.minesAmount).toHaveBeenCalledWith(NaN);
        });

        it('should handle errors from storageService.minesAmount', async () => {
            const error = new Error('Material not found or insufficient count');
            mockStorageService.minesAmount.mockRejectedValue(error);

            await expect(controller.minesMeterialCount(mockMaterialId.toString())).rejects.toThrow(error);
            expect(mockStorageService.minesAmount).toHaveBeenCalledWith(mockMaterialId);
        });
    });

    describe('deleteMeterial', () => {
        it('should call storageService.deleteMaterials with id and userId', async () => {
            const idParam = mockMaterialId.toString();
            const expectedData = {
                id: mockMaterialId,
                userId: mockUserId
            };
            const expectedResult = { id: mockMaterialId, deleted: true };
            
            mockStorageService.deleteMaterials.mockResolvedValue(expectedResult);

            const result = await controller.deleteMeterial(idParam, mockRequest);

            expect(mockStorageService.deleteMaterials).toHaveBeenCalledWith(expectedData);
            expect(mockStorageService.deleteMaterials).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });

        it('should handle NaN id parameter', async () => {
            const invalidId = 'invalid';
            const result = await controller.deleteMeterial(invalidId, mockRequest);
            
            expect(mockStorageService.deleteMaterials).toHaveBeenCalledWith({
                id: NaN,
                userId: mockUserId
            });
        });

        it('should handle errors from storageService.deleteMaterials', async () => {
            const error = new Error('Material not found or permission denied');
            mockStorageService.deleteMaterials.mockRejectedValue(error);

            await expect(controller.deleteMeterial(mockMaterialId.toString(), mockRequest)).rejects.toThrow(error);
            expect(mockStorageService.deleteMaterials).toHaveBeenCalledWith({
                id: mockMaterialId,
                userId: mockUserId
            });
        });
    });

    describe('Version decorators', () => {
        it('should have version 1 on findAll method', () => {
            const metadata = Reflect.getMetadata('__version__', StorageController.prototype.findAll);
            expect(metadata).toBe('1');
        });

        it('should have version 1 on addMaterials method', () => {
            const metadata = Reflect.getMetadata('__version__', StorageController.prototype.addMaterials);
            expect(metadata).toBe('1');
        });

        it('should have version 1 on plusMeterialCount method', () => {
            const metadata = Reflect.getMetadata('__version__', StorageController.prototype.plusMeterialCount);
            expect(metadata).toBe('1');
        });

        it('should have version 1 on minesMeterialCount method', () => {
            const metadata = Reflect.getMetadata('__version__', StorageController.prototype.minesMeterialCount);
            expect(metadata).toBe('1');
        });

        it('should have version 1 on deleteMeterial method', () => {
            const metadata = Reflect.getMetadata('__version__', StorageController.prototype.deleteMeterial);
            expect(metadata).toBe('1');
        });
    });

    describe('Guard', () => {
        it('should have AuthGuard applied to controller', () => {
            const guards = Reflect.getMetadata('__guards__', StorageController);
            expect(guards).toBeDefined();
            expect(guards[0]).toBe(AuthGuard);
        });
    });
});