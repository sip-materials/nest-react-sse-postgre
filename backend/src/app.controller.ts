import { Body, Controller, Get, Post, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { NewMessageDto } from './dto/message.dto';
import { SSEService } from './sse.service';
import { Observable, map } from 'rxjs';
import { MessageEntity } from './entities/message.entity';
import { MessageEvent } from './interfaces/message.sse';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sseService: SSEService,
  ) { }

  @Post('add-message')
  addMessage(@Body() newMessageDto: NewMessageDto) {
    return this.appService.addMessage(newMessageDto);
  }

  @Get('all-messages')
  getMessages() {
    return this.appService.getMessages()
  }

  @Sse('sse')
  updateMessage(): Observable<MessageEvent> {
    return this.sseService.dbUpdateEvents$.pipe(
      map((event: MessageEntity) => ({
        data: event
      }))
    );
  }
}
