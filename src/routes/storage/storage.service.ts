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
            //getting all materials
            const materials = await this.prismaService.refrigerator.findMany({
                where: {
                    userId: userId
                }
            });
            //cheking is that exist!
            if (!materials) {
                throw new NotFoundException("Materials Not Found!");
            }

            return {
                message: "ok",
                data: materials
            }
        }
        catch (e: any) {
            if (e instanceof NotFoundException) return {
                message: "Not Found Error!",
                data: null,
                error: true
            };
            console.log("findAll Error in StorageService from the stroage.service.ts!");
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async addNewMaterials(data: { dto: MaterialDto, userId: number }) {
        try {
            //checking does this material exist or not!
            const findMaterial = await this.prismaService.refrigerator.findFirst({
                where: {
                    name: data.dto.name,
                    userId: data.userId
                }
            });
            if (findMaterial) {
                throw new BadRequestException("This Material Already Exists!");
            }

            //if it doesn't exist we would create that as a new material
            const newData = {
                name: data.dto.name,
                userId: data.userId
            }
            const newMaterial = await this.prismaService.refrigerator.create({
                data: newData
            });

            //responsing
            return {
                message: "Created",
                data : {
                    name : newMaterial.name,
                    amount : newMaterial.amount,
                    id : newMaterial.id,
                }
           };
        }
        catch (e: any) {
            if(e instanceof BadRequestException) return {
                message : "Bad Request",
                data : null,
                error : true
            };
            console.log("addNewMaterial Error in SotrageService class from the storage.service.ts file!");
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async plusAmount(materialId: number) {
        try {
            //finding the Material :
            const findMaterial = await this.prismaService.refrigerator.findFirst({
                where : {
                    id : materialId
                }
            });
            //checking this Exists or doesn't!
            if(!findMaterial){
                throw new NotFoundException("This Material Not Found!");
            };
            //creating new data
            const newData = {
                name : findMaterial.name,
                userId : findMaterial.userId,
                amount : findMaterial.amount += 100,
            };

            //updaing this meteryal (only this amount!)
            const UpdateMaterial = await this.prismaService.refrigerator.update({
                where : {
                    id : materialId
                },
                data : newData
            });

            //responsing
            return {
                message : "Ok",
                data : {
                    name : UpdateMaterial.name,
                    amount : UpdateMaterial.amount,
                    id : UpdateMaterial.id
                }
            }

        }
        catch (e: any) {
            if(e instanceof NotFoundException) return {
                message : "Not Found Error",
                data : null,
                error : true
            }
            console.log("plusAmount Error in StorageService class from storage.service.ts file!");
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async minesAmount(materialId: number) {
        try {
            //finding the Material :
            const findMaterial = await this.prismaService.refrigerator.findFirst({
                where : {
                    id : materialId
                }
            });
            //checking this Exists or doesn't!
            if(!findMaterial){
                throw new NotFoundException("This Material Not Found!");
            };
            //creating new data
            const newData = {
                name : findMaterial.name,
                userId : findMaterial.userId,
                amount : findMaterial.amount > 100 ? findMaterial.amount -= 100 : 100,
            };

            //updaing this meteryal (only this amount!)
            const UpdateMaterial = await this.prismaService.refrigerator.update({
                where : {
                    id : materialId
                },
                data : newData
            });

            //responsing
            return {
                message : "Ok",
                data : {
                    name : UpdateMaterial.name,
                    amount : UpdateMaterial.amount,
                    id : UpdateMaterial.id
                }
            }

        }
        catch (e: any) {
            if(e instanceof NotFoundException) return {
                message : "Not Found Error!",
                data : null,
                error : true
            }
            console.log("plusAmount Error in StorageService class from storage.service.ts file!");
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async deleteMaterials(dto : {id : number, userId : number}){
        try{
            //checking does the same meterial exists in user Storage?
            const findMaterial = await this.prismaService.refrigerator.findFirst({
                where : {
                    id : dto.id,
                    userId : dto.userId
                }
            });
            if(!findMaterial){
                throw new NotFoundException("The Same Material Not Found In Your Refrigerator!");
            }

            await this.prismaService.refrigerator.delete({
                where : {
                    id : dto.id,
                    userId : dto.userId
                }
            });


            return {
                message : "Ok",
            }

        }
        catch(e : any){
            if(e instanceof NotFoundException) return {
                message : "Not Found Error",
                data : null,
                error : true,
            }
            console.log("deletematerials Error in StorageService class from storage.service.ts file : ", e);
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

};