import {Module} from "@nestjs/common";

//other modules for Providers
import { PrismaModule } from "src/common/prisma/prisma.module";

//provider & controller
import { StorageService } from "./storage.service";
import { StorageController } from "./storage.controller";

@Module({
    imports : [
        PrismaModule
    ],
    controllers : [
        StorageController
    ],
    providers : [
        StorageService,
    ],
})
export class StorageModule{};