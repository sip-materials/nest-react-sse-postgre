import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { NewMessageDto } from './dto/message.dto';
import { PrismaService } from './prisma.service';
import * as moment from 'moment';
import { Client } from 'pg'

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private pgClient: Client;
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async onModuleInit() {
    const dbURL = new URL(process.env.DATABASE_URL)
    this.pgClient = new Client({
      hostname: dbURL.hostname,
      port: dbURL.port,
      user: dbURL.username,
      password: dbURL.password,
      database: dbURL.pathname.split('/')[1],
      schema: dbURL.searchParams.get("schema"),
    });
    await this.pgClient.connect();
  }

  async onModuleDestroy() {
    await this.pgClient.end();
  }

  async addMessage(newMessageDto: NewMessageDto) {
    const created = await this.prisma.messages.create({
      data: {
        content: newMessageDto.content,
        createdAt: moment().unix(),
        updatedAt: moment().unix(),
      }
    });
    const updated_data = JSON.stringify(created)
    await this.pgClient.query(
      `NOTIFY messages, '${updated_data}'`
    );
    return created;
  }

  getMessages() {
    return this.prisma.messages.findMany();
  }
}
