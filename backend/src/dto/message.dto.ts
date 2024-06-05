import { IsString } from "class-validator";

export class NewMessageDto {
    @IsString()
    content: string;
}