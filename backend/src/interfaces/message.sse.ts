import { MessageEntity } from "src/entities/message.entity";

export interface MessageEvent {
    data: MessageEntity;
    id?: string;
    type?: string;
    retry?: number;
}
