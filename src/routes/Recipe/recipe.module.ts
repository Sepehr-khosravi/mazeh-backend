import { Module } from "@nestjs/common";
//modules
import { PrismaModule } from "src/common/prisma/prisma.module";

//provider & contorller
import { RecipeController } from "./recipe.controller";
import { RecipeService } from "./recipe.service";

@Module({
    imports : [
        PrismaModule,
    ],
    providers : [
        RecipeService
    ],
    controllers : [
        RecipeController
    ]
})
export class RecipeModule{};