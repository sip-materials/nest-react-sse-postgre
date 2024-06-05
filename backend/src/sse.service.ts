import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Client } from "pg";
import { Subject } from "rxjs";
import { MessageEntity } from "./entities/message.entity";

@Injectable()
export class SSEService implements OnModuleInit, OnModuleDestroy {
    private pgClient: Client;
    private dbEventsSubject = new Subject<any>();
    constructor() { }

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
        this.pgClient.on('notification', (msg) => {
            if (msg.channel === 'messages') {
                this.dbEventsSubject.next(JSON.parse(msg.payload) as MessageEntity);
            }
        });
        await this.pgClient.query('LISTEN messages');
    }

    async onModuleDestroy() {
        await this.pgClient.end();
    }

    get dbUpdateEvents$() {
        return this.dbEventsSubject.asObservable();
    }
}