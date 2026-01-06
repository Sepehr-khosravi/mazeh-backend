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

    @Get()//rotue : /storage/ (Method : Get);
    @Version("1")
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

    @Patch("count/plus/:id")//route : /storage/count/plus:id (id is a Param!) (method : Patch)
    @Version("1")
    plusMeterialCount(@Param("id") data) {
        const id = parseInt(data);

        return this.storageService.plusAmount(id);
    }

    @Patch("count/mines/:id")//route : /storage/count/plus:id (method : patch)
    @Version("1")
    minesMeterialCount(@Param("id") data) {
        const id = parseInt(data);
        return this.storageService.minesAmount(id);
    }

    @Delete("/delete/:id")//route : /storage/delete/:id (Method : Delete) 
    @Version("1")
    deleteMeterial(@Param("id") data, @Req() req){//(add a include: id is a Param and the route must be something like this : /storage/delete/1)
        const id = parseInt(data);
        return this.storageService.deleteMaterials({id, userId : req.user.id});
    }

};