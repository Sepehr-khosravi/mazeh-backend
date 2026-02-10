import { Module } from "@nestjs/common";
//modules
import { PrismaModule } from "src/common/prisma/prisma.module";

//provider & contorller
import { RecipeService } from "./recipe.service";
import { RecipeController } from "./recipe.controller";

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