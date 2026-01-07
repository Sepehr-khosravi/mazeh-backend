import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../prisma/generated/client';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {parse} from "pg-connection-string";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(
    configService : ConfigService
  ) {
    const dbAddress = configService.get("DATABASE_URL");
    const parseAddress = parse(dbAddress);
    const adapter = new PrismaPg(parseAddress);
    super({
      adapter : adapter
    }); 
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
