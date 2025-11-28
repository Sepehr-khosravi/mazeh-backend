import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ConfigModule } from "@nestjs/config";

//prisma module
@Module({
    imports : [ConfigModule],
    providers : [PrismaService],
    exports : [PrismaService]
})
export class PrismaModule {};