import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

//providers
import { PrismaService } from "src/common/prisma/prisma.service";

//dto
import {
    MaterialDto
} from "./dto";

@Injectable({})
export class StorageService {
    constructor(
        private prismaService: PrismaService
    ) { };

    async findAll(userId: number) {
        try {
            const materials = await this.prismaService.refrigerator.findMany({
                where: {
                    userId: userId
                }
            });

            return {
                message: "ok",
                data: materials.map(material => ({
                    id: material.id,
                    name: material.name,
                    type: material.type,
                    count: material.count
                }))
            };
        }
        catch (e: any) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async addNewMaterials(data: { dto: MaterialDto, userId: number }) {
        try {
            const findMaterial = await this.prismaService.refrigerator.findFirst({
                where: {
                    name: data.dto.name,
                    type: data.dto.type,
                    userId: data.userId
                }
            });

            if (findMaterial) {
                throw new BadRequestException("This Material Already Exists!");
            }

            const newMaterial = await this.prismaService.refrigerator.create({
                data: {
                    name: data.dto.name,
                    type: data.dto.type,
                    count: data.dto.count,
                    userId: data.userId
                }
            });

            return {
                message: "Created",
                data: {
                    id: newMaterial.id,
                    name: newMaterial.name,
                    type: newMaterial.type,
                    count: newMaterial.count
                }
            };
        }
        catch (e: any) {
            if (e instanceof BadRequestException) {
                throw e;
            }
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async plusAmount(materialId: number) {
        try {
            const findMaterial = await this.prismaService.refrigerator.findFirst({
                where: {
                    id: materialId
                }
            });

            if (!findMaterial) {
                throw new NotFoundException("This Material Not Found!");
            }

            const updatedMaterial = await this.prismaService.refrigerator.update({
                where: {
                    id: materialId
                },
                data: {
                    count: findMaterial.count + 100
                }
            });

            return {
                message: "Ok",
                data: {
                    id: updatedMaterial.id,
                    name: updatedMaterial.name,
                    type: updatedMaterial.type,
                    count: updatedMaterial.count
                }
            };
        }
        catch (e: any) {
            if (e instanceof NotFoundException) {
                throw e;
            }
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async minesAmount(materialId: number) {
        try {
            const findMaterial = await this.prismaService.refrigerator.findFirst({
                where: {
                    id: materialId
                }
            });

            if (!findMaterial) {
                throw new NotFoundException("This Material Not Found!");
            }

            if (findMaterial.count < 100) {
                throw new BadRequestException(`Insufficient count! Current count is ${findMaterial.count}`);
            }

            const updatedMaterial = await this.prismaService.refrigerator.update({
                where: {
                    id: materialId
                },
                data: {
                    count: findMaterial.count - 100
                }
            });

            return {
                message: "Ok",
                data: {
                    id: updatedMaterial.id,
                    name: updatedMaterial.name,
                    type: updatedMaterial.type,
                    count: updatedMaterial.count
                }
            };
        }
        catch (e: any) {
            if (e instanceof NotFoundException || e instanceof BadRequestException) {
                throw e;
            }
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async deleteMaterials(dto: { id: number, userId: number }) {
        try {
            const findMaterial = await this.prismaService.refrigerator.findFirst({
                where: {
                    id: dto.id,
                    userId: dto.userId
                }
            });

            if (!findMaterial) {
                throw new NotFoundException("The Same Material Not Found In Your Refrigerator!");
            }

            await this.prismaService.refrigerator.delete({
                where: {
                    id: dto.id,
                    userId: dto.userId
                }
            });

            return {
                message: "Ok",
                data: {
                    id: findMaterial.id,
                    name: findMaterial.name,
                    type: findMaterial.type,
                    count: findMaterial.count,
                    deleted: true
                }
            };
        }
        catch (e: any) {
            if (e instanceof NotFoundException) {
                throw e;
            }
            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}