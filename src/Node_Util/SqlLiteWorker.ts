import * as FsP from 'node:fs/promises';
import path from 'path';
import Database from 'better-sqlite3';
import { cwd } from 'process'
enum operation {
    'createUser',
    'createMessages',
    'createMessageContent',
    'insertMessages',
    'insertUser',
    'getMessageContent',
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

    public insertUser(id: string, name: string, avatar: string) {
        try {
            const statement = this.statementMap.get(operation.insertUser);
            statement?.run({ id, name, avatar });
        } catch (error) {
            this.handleError(error);
        }
    }

    public insertMessages(id: string, type: string, date: number, userId: string) {
        try {
            const statement = this.statementMap.get(operation.insertMessages);
            statement?.run({ id, type, date, userId });
        } catch (error) {
            this.handleError(error);
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
            statement?.run({ id, sendBy, sendTo, text, image, date });
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
                userId TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES USER (id)
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
                date INT NOT NULL,
                FOREIGN KEY (sendBy) REFERENCES USER (id)
                FOREIGN KEY (sendTo) REFERENCES USER (id)
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
            INSERT OR REPLACE INTO MESSAGES (id, type, date, userId)
            VALUES(@id, @type, @date, @userId)
            `
        )

        const getMessageContent = this.db.prepare(
            `
            SELECT * FROM MESSAGECONTENT WHERE sendBy = @sendBy AND sendTo = @sendTo
            `
        )
        this.statementMap.set(operation.insertMessages, insertMessages);
        this.statementMap.set(operation.insertMessageContent, insertMessageContent);
        this.statementMap.set(operation.insertUser, insertUser)
        this.statementMap.set(operation.getMessageContent, getMessageContent);
    }

    private handleError(error: unknown) {
        console.error(error);
        throw error;
    }
}