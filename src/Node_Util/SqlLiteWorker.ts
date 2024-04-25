import * as FsP from 'node:fs/promises';
import path from 'path';
import Database from 'better-sqlite3';
import { cwd } from 'process'
import type { MessageListItem, SqlMessage, SqlMessageContent, SqlUser } from '../Interface/NodeLocalStorage';
enum operation {
    'createUser',
    'createMessages',
    'createMessageContent',
    'insertMessages',
    'insertUser',
    'getUser',
    'getMessageContent',
    'getMessageContentById',
    'getMessages',
    'insertMessageContent'
}

export class SqlLiteWorker {
    private db!: Database.Database;
    private dbPath!: string;
    private statementMap: Map<operation, Database.Statement> = new Map();
    constructor(userId: string) {
        try {
            // create SqlLiteWorker instance, if not exists, it is created
            this.dbPath = path.join(cwd(), 'message', `${userId}.db`);
            console.log(this.dbPath);
            this.db = Database(this.dbPath);
            this.db.pragma('journal_mode = WAL');
            this.createTable();
            this.prepare();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 将user的id，name和avatar插入数据库内，如果原用户存在，则进行替换操作
     * @param id 
     * @param name 
     * @param avatar 
     */
    public insertUser(id: string, name: string, avatar: string) {
        try {
            const statement = this.statementMap.get(operation.insertUser);
            statement?.run({ id, name, avatar });
        } catch (error) {
            this.handleError(error);
        }
    }

    public insertMessages(id: string, type: string, date: number, lastMessage: string) {
        try {
            const statement = this.statementMap.get(operation.insertMessages);
            const result = statement?.run({ id, type, date, lastMessage });
            console.log('sqlite insert Messages: ', result);
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * 返回所有的消息列表
     */
    public getMessageList(): MessageListItem[] {
        try {
            const statement = this.statementMap.get(operation.getMessages);
            const contentStatement = this.statementMap.get(operation.getMessageContentById);
            const userStatement = this.statementMap.get(operation.getUser);
            const messageList: MessageListItem[] = [];
            const result = statement?.all() as SqlMessage[];
            for (const message of result) {
                const messageContent = contentStatement?.get({ id: message.lastMessage }) as SqlMessageContent;
                const user = userStatement?.get({ id: message.id }) as SqlUser;
                messageList.push({
                    type: message.type,
                    info: user,
                    content: messageContent,
                    date: message.date
                })
            }
            console.log('\n\n\n\n\nsql messageList ', messageList);
            console.log('\n\n\n\n\n\n\n');
            return messageList;
        } catch (error) {
            this.handleError(error);
            throw (error)
        }
    }

    public insertMessageContent(id: string,
        sendBy: string,
        sendTo: string,
        text: string,
        image: string[] | string | null,
        date: number) {
        try {
            const statement = this.statementMap.get(operation.insertMessageContent);
            const res = statement?.run({ id, sendBy, sendTo, text, image, date });
            console.log('sql insert messageContent: ', res);
        } catch (error) {
            this.handleError(error);
        }
    }

    public getMessageContent(sendBy: string, sendTo: string) {
        try {
            const statement = this.statementMap.get(operation.getMessageContent);
            return statement?.all({ sendBy, sendTo });
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    /**
     * 创建所需的sql table
     */
    private createTable() {
        const createUser = this.db.prepare(`
        CREATE TABLE IF NOT EXISTS USER(
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            avatar TEXT NOT NULL
        );
    `);
        const createMessages = this.db.prepare(
            `
            CREATE TABLE IF NOT EXISTS MESSAGES(
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                date INT NOT NULL,
                lastMessage TEXT NOT NULL,
                FOREIGN KEY("lastMessage") REFERENCES "MESSAGECONTENT"("id")
            );
            `
        )
        const createMessageContent = this.db.prepare(
            `
            CREATE TABLE IF NOT EXISTS MESSAGECONTENT(
                id TEXT PRIMARY KEY,
                sendBy TEXT NOT NULL,
                sendTo TEXT NOT NULL,
                text TEXT NOT NULL,
                image TEXT,
                date INT NOT NULL
            )
            `
        )
        createUser.run();
        createMessages.run();
        createMessageContent.run();
        this.statementMap.set(operation.createUser, createUser);
        this.statementMap.set(operation.createMessages, createMessages);
        this.statementMap.set(operation.createMessageContent, createMessageContent);
    }

    /**
     * 创建所有的prepare sql语句
     */
    private prepare() {
        const insertMessageContent = this.db.prepare(
            `
            INSERT INTO MESSAGECONTENT (id, sendBy, sendTo, text, image, date)
            VALUES (@id, @sendBy, @sendTo, @text, @image, @date)
            `
        )
        const insertUser = this.db.prepare(
            `
            INSERT OR REPLACE INTO USER (id, name, avatar)
            VALUES (@id, @name, @avatar)
            `
        )
        const insertMessages = this.db.prepare(
            `
            INSERT OR REPLACE INTO MESSAGES (id, type, date, lastMessage)
            VALUES(@id, @type, @date, @lastMessage)
            `
        )

        const getMessageContent = this.db.prepare(
            `
            SELECT * FROM MESSAGECONTENT WHERE sendBy = @sendBy AND sendTo = @sendTo
            `
        )

        const getMessageContentById = this.db.prepare(
            `
            SELECT * FROM MESSAGECONTENT WHERE id = @id
            `
        )

        const getMessages = this.db.prepare(
            `
            SELECT * FROM MESSAGES
            `
        )

        const getUser = this.db.prepare(
            `
            SELECT * FROM USER
            WHERE id = @id
            `
        )
        this.statementMap.set(operation.insertMessages, insertMessages);
        this.statementMap.set(operation.insertMessageContent, insertMessageContent);
        this.statementMap.set(operation.insertUser, insertUser)
        this.statementMap.set(operation.getMessageContent, getMessageContent);
        this.statementMap.set(operation.getMessageContentById, getMessageContentById);
        this.statementMap.set(operation.getMessages, getMessages);
        this.statementMap.set(operation.getUser, getUser)
    }

    private handleError(error: unknown): any {
        console.error(error);
        throw error;
    }
}