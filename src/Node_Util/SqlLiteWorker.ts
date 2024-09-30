import path from "path";
import Database from "better-sqlite3";
import { cwd } from "process";
import type {
    MessageListItem,
    Messages,
    SqlMessage,
    SqlMessageContent,
    SqlUser,
} from "../Interface/NodeLocalStorage";

enum operation {
    "createUser",
    "createMessages",
    "createMessageContent",
    "insertMessages",
    "insertUser",
    "getUser",
    "getMessageContent",
    "getMessageContentById",
    "getMessages",
    "insertMessageContent",
    "insertEmoji",
    "getEmoji",
}

export class SqlLiteWorker {
    private db!: Database.Database;
    private dbPath!: string;
    private statementMap: Map<operation, Database.Statement> = new Map();
    constructor(userId: string) {
        try {
            // create SqlLiteWorker instance, if not exists, it is created
            this.dbPath = path.join(cwd(), "message", `${userId}.db`);
            this.db = Database(this.dbPath);
            this.db.pragma("journal_mode = WAL");
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

    public insertMessages(
        id: string,
        type: string,
        date: number,
        lastMessage: string,
    ) {
        try {
            const statement = this.statementMap.get(operation.insertMessages);
            const result = statement?.run({ id, type, date, lastMessage });
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
            const contentStatement = this.statementMap.get(
                operation.getMessageContentById,
            );
            const userStatement = this.statementMap.get(operation.getUser);
            const messageList: MessageListItem[] = [];
            const result = statement?.all() as SqlMessage[];
            for (const message of result) {
                const messageContent = contentStatement?.get({
                    id: message.lastMessage,
                }) as SqlMessageContent;
                const user = userStatement?.get({ id: message.id }) as SqlUser;
                messageList.push({
                    type: message.type,
                    info: user,
                    content: messageContent,
                    date: message.date,
                });
            }
            return messageList;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public getMessageContents(
        senderid: string,
        receiverid: string,
        limit?: number,
        offset?: number,
    ): Messages {
        try {
            const userStatement = this.statementMap.get(operation.getUser);
            const messageStatement = this.statementMap.get(
                operation.getMessageContent,
            );
            const userInfo: Map<string, SqlUser> = new Map();
            userInfo.set(
                senderid,
                userStatement?.get({ id: senderid }) as SqlUser,
            );
            userInfo.set(
                receiverid,
                userStatement?.get({ id: receiverid }) as SqlUser,
            );
            const messages = messageStatement?.all({
                sendBy: senderid,
                sendTo: receiverid,
                offset,
                limit,
            }) as SqlMessageContent[];
            return { messages, userInfo };
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public insertMessageContent(
        id: string,
        sendBy: string,
        sendTo: string,
        text: string,
        type: "to" | "from",
        image: string[] | string | null,
        date: number,
    ) {
        try {
            console.log({ id, sendBy, sendTo, text, type, image, date });
            const statement = this.statementMap.get(
                operation.insertMessageContent,
            );
            const res = statement?.run({
                id,
                sendBy,
                sendTo,
                text,
                image,
                date,
                type,
            });
            console.log("sql insert messageContent: ", res);
        } catch (error) {
            this.handleError(error);
        }
    }

    public getMessageContent(sendBy: string, sendTo: string) {
        try {
            const statement = this.statementMap.get(
                operation.getMessageContent,
            );
            return statement?.all({ sendBy, sendTo });
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    public insertEmoji(
        id: string,
        date: number,
        remoteAdd: string,
        localAdd: string,
    ) {
        try {
            const statement = this.db.prepare(
                `
                INSERT OR REPLACE INTO EMOJI(id, date, remoteAdd, localAdd)
                VALUES(@id, @date, @remoteAdd, @localAdd)
                `,
            );
            statement.run({ id, date, remoteAdd, localAdd });
        } catch (error) {
            this.handleError(error);
        }
    }

    public getEmojis() {
        try {
            const statement = this.db.prepare(
                `
                SELECT * FROM EMOJI
                ORDER BY date ASC
                `,
            );
            const emojis = statement.all();
            return emojis;
        } catch (error) {
            this.handleError(error);
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
            `,
        );
        const createMessageContent = this.db.prepare(
            `
            CREATE TABLE IF NOT EXISTS MESSAGECONTENT(
                id TEXT PRIMARY KEY,
                sendBy TEXT NOT NULL,
                sendTo TEXT NOT NULL,
                text TEXT NOT NULL,
                type TEXT NOT NULL,
                image TEXT,
                date INT NOT NULL
            )
            `,
        );
        const createEmoji = this.db.prepare(
            `
            CREATE TABLE IF NOT EXISTS EMOJI(
                id TEXT PRIMARY KEY NOT NULL,
                date INT NOT NULL,
                remoteAdd TEXT,
                localAdd TEXT
            )
            `,
        );
        createUser.run();
        createMessages.run();
        createMessageContent.run();
        createEmoji.run();
        this.statementMap.set(operation.createUser, createUser);
        this.statementMap.set(operation.createMessages, createMessages);
        this.statementMap.set(
            operation.createMessageContent,
            createMessageContent,
        );
    }

    /**
     * 创建所有的prepare sql语句
     */
    private prepare() {
        const insertMessageContent = this.db.prepare(
            `
            INSERT INTO MESSAGECONTENT (id, sendBy, sendTo, text, image, date, type)
            VALUES (@id, @sendBy, @sendTo, @text, @image, @date, @type)
            `,
        );
        const insertUser = this.db.prepare(
            `
            INSERT OR REPLACE INTO USER (id, name, avatar)
            VALUES (@id, @name, @avatar)
            `,
        );
        const insertMessages = this.db.prepare(
            `
            INSERT OR REPLACE INTO MESSAGES (id, type, date, lastMessage)
            VALUES(@id, @type, @date, @lastMessage)
            `,
        );

        const getMessageContent = this.db.prepare(
            `
            SELECT * FROM MESSAGECONTENT 
            WHERE (sendBy = @sendBy AND sendTo = @sendTo) OR (sendBy = @sendTo AND sendTo = @sendBy)
            ORDER BY date ASC
            LIMIT @limit OFFSET @offset
            `,
        );

        const getMessageContentById = this.db.prepare(
            `
            SELECT * FROM MESSAGECONTENT WHERE id = @id
            `,
        );

        const getMessages = this.db.prepare(
            `
            SELECT * FROM MESSAGES
            `,
        );

        const getUser = this.db.prepare(
            `
            SELECT * FROM USER
            WHERE id = @id
            `,
        );
        this.statementMap.set(operation.insertMessages, insertMessages);
        this.statementMap.set(
            operation.insertMessageContent,
            insertMessageContent,
        );
        this.statementMap.set(operation.insertUser, insertUser);
        this.statementMap.set(operation.getMessageContent, getMessageContent);
        this.statementMap.set(
            operation.getMessageContentById,
            getMessageContentById,
        );
        this.statementMap.set(operation.getMessages, getMessages);
        this.statementMap.set(operation.getUser, getUser);
    }

    public async saveRemoteFile(
        type: "emoji" | "file" | "images",
        url: string,
        fileName: string,
    ) {
        try {
            const Path = await import("path");
            const fsP = await import("node:fs/promises");
            const imagePath = Path.join(cwd(), "message", type, fileName);
            const isExisted = await fsP.stat(imagePath).catch(() => null);
            // if target emoji is existed, we just return the path
            if (isExisted) {
                return imagePath;
            } else {
                // or we download the image and save it locally
                const handle = await fsP.open(imagePath, "w");
                const response = await fetch(url);
                if (response.ok) {
                    const buffer = Buffer.from(
                        new Uint8Array(await response.arrayBuffer()),
                    );
                    await fsP.writeFile(handle, buffer);
                    handle.close();
                    return imagePath;
                }
            }
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    private handleError(error: unknown): any {
        console.error(error);
        throw error;
    }
}
