import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { SSEService } from './sse.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService, SSEService],
})
export class AppModule { }
