import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    UseGuards,
    Param,
    Req,
    Delete,
    Version
} from "@nestjs/common";


//auth Gaurd 
import { AuthGuard } from '../../common/Guards/auth/jwt-auth.guard';


//dto
import {
    MaterialDto,    
} from "./dto";

//privders
import { PrismaService } from "src/common/prisma/prisma.service";
import { StorageService } from './storage.service';


@UseGuards(AuthGuard)
@Controller("storage")//route /storage
export class StorageController {
    constructor(
        private prismaService: PrismaService,
        private storageService: StorageService
    ) { };

    @Version("1")
    @Get()//rotue : /storage/ (Method : Get);
    findAll(@Req() req) {
        return this.storageService.findAll(req.user.id);
    };

    @Post("add") //route : /storage/add (Method : Post);
    @Version("1")
    addMaterials(@Body() dto: MaterialDto, @Req() req) {
        const data = {
            dto: dto,
            userId: req.user.id
        }
        return this.storageService.addNewMaterials(data);
    };

    @Version("1")
    @Patch("count/plus/:id")//route : /storage/count/plus:id (id is a Param!) (method : Patch)
    plusMeterialCount(@Param("id") data) {
        const id = parseInt(data);

        return this.storageService.plusAmount(id);
    }
    
    @Version("1")
    @Patch("count/mines/:id")//route : /storage/count/plus:id (method : patch)
    minesMeterialCount(@Param("id") data) {
        const id = parseInt(data);
        return this.storageService.minesAmount(id);
    }

    @Version("1")
    @Delete("/delete/:id")//route : /storage/delete/:id (Method : Delete) 
    deleteMeterial(@Param("id") data, @Req() req){//(add a include: id is a Param and the route must be something like this : /storage/delete/1)
        const id = parseInt(data);
        return this.storageService.deleteMaterials({id, userId : req.user.id});
    }

};