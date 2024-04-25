const { io, Socket } = require("socket.io-client");
// import { io, Socket } from 'socket.io-client';
import { mainWindow } from "../main.ts";
import type { SocketUserInfo, PrivateMessage, MessageContent, GroupMessage } from "../Interface/user.ts";
import { WorkerController } from './WorkerController';
import { NotificationController } from "../Electron/index.ts";
import { MessageType, LocalUserInfo, LocalMessageContent } from "../Interface/NodeLocalStorage.ts";
import { SqlLiteWorker } from "./SqlLiteWorker.ts";
const SocketURL = 'http://43.163.234.220:8081';
class Socketio {
    private static instance: Socketio | undefined;
    private socket: typeof Socket;
    private usermap: Map<string, SocketUserInfo>;
    private message: Map<string, Array<PrivateMessage>>;
    private workerController: WorkerController;
    private SqlLiteController: SqlLiteWorker;
    private constructor(url: string, name: string, _id: string, avatar: string) {
        this.socket = io(url, {
            auth: {
                username: name,
                _id,
                avatar
            },
        });
        this.usermap = new Map();
        this.message = new Map();
        this.SqlLiteController = new SqlLiteWorker(_id);
        this.workerController = new WorkerController();
        //              Socket.io event listener binding
        //  In this area we can add eventlistener for upcoming socket.io event,
        //  including private_message/group_message, when adding event listener be sure
        //  the server will actually send those events.
        //              Socket.io 事件监听绑定区域
        //  在这个地方可以为socket.io 服务器发送的事件添加事件监听回调函数，在监听事件的时候请注意查看
        //  服务器发送的事件名字以及参数。
        //
        this.socket.on('connect', (data: any) => {
            mainWindow?.webContents.send('connect', this.socket.id);
        })
        this.socket.on('users', (data: string) => {
            // when server sends new usermap, we replace it
            this.usermap = new Map(JSON.parse(data));
            mainWindow?.webContents.send('usermap', this.usermap);
        });

        this.socket.on('user_connected', (data: any) => {
            this.usermap.set(data.userid, data);
            mainWindow?.webContents.send('userConnected', data.userInfo);
        });

        this.socket.on('user_disconnect', (userid: string) => {
            this.usermap.delete(userid);
            mainWindow?.webContents.send('userDiconnected', userid);
        });

        this.socket.on('private_message', (data: PrivateMessage) => {
            const { senderid, senderavatar, sendername, content, receivername, receiveravatar, receiverid, ObjectId } = data;
            if (!this.message.has(data.senderid)) {
                this.message.set(data.senderid, []);
            }
            this.message.get(data.senderid)?.push(data);
            NotificationController.sendNotification(data.content.text, data.sendername, data.senderavatar);
            mainWindow?.webContents.send('privateMessage', data);
            this.workerController.saveMessage(data.senderid, MessageType.Private,
                {
                    content: { type: 'from', sendBy: data.senderid, content: { ...data.content } },
                    date: new Date()
                },
                {
                    name: data.sendername,
                    avatar: data.senderavatar,
                    userId: data.senderid
                });
            const unixTimeStamp = new Date().getTime() * 1000
            this.SqlLiteController.insertUser(senderid, sendername, senderavatar);
            this.SqlLiteController.insertUser(receiverid, receivername, receiveravatar);
            this.SqlLiteController.insertMessages(senderid, 'private', unixTimeStamp, ObjectId as string);
            this.SqlLiteController.insertMessageContent(ObjectId as string,
                senderid, receiverid,
                content.text,
                content.image as unknown as string,
                unixTimeStamp);
        });
        this.socket.on('user_group_message', (data: GroupMessage) => {
            mainWindow?.webContents.send('userGroupMessage', data);
            this.workerController.saveMessage(data.from, MessageType.Group,
                {
                    content: { type: 'from', sendBy: data.senderid, content: data.content },
                    date: new Date()
                },
                {
                    name: data.sendername,
                    avatar: data.senderavatar,
                    userId: data.senderid
                });
        })
        this.socket.on('user_join_group', (data) => {
            console.log(`A user join the room ${data.userName}`);
        })
    }

    //              Socket.io client emits
    //  In this area we can define method that use io object to send event 
    //  to serve, make sure server is actually listening those events
    //              Socket.io 客户端事件发送
    //  在这个地方可以定义客户端向服务器发送的事件，大部分的事件都需要使用io对象发送。
    //  在发送的时候请注意查看服务器是否在监听这些事件，以及发送的参数数据是否被接收。
    //
    public static getInstance(): Socketio;
    public static getInstance(name: string, _id: string, avatar: string): Socketio | undefined;
    public static getInstance(name?: string, _id?: string, avatar?: string): Socketio | undefined {
        if (!Socketio.instance) {
            if (name && _id && avatar) {
                Socketio.instance = new Socketio(SocketURL, name, _id, avatar);
            }
        }
        return Socketio.instance as Socketio;
    }

    public getSocket(): typeof Socket {
        return this.socket;
    }

    public getUserMap() {
        return this.usermap;
    }

    /**
     * 用于发送私信的函数，这个函数会将message发送到socket服务器，服务器会首先尝试将消息
     * 存储到数据库，随后会向目标用户发送私信事件。当这两者都完成后会执行回调，将消息的id返回到客户端。
     * 获得消息的id后我们将其存储到用户的sqlite数据库内。
     * @param to 
     * @param message 
     */
    public sendPrivateMessage(to: string, message: PrivateMessage): Promise<Boolean> {
        // send the content to target recerver
        return new Promise<Boolean>((resolve, reject) => {
            const { senderid, senderavatar, sendername, content, receivername, receiveravatar, receiverid } = message;
            this?.socket.emit('private_message', {
                to,
                ...message
            }, (messageId: string) => {
                // We sending message to receiver, so we store the info
                // of the receiver, not ours
                try {
                    // insert sender's and receiver's userinfo into sqlite
                    // exist info will be replaced
                    this.SqlLiteController.insertUser(senderid, sendername, senderavatar);
                    this.SqlLiteController.insertUser(receiverid, receivername, receiveravatar);
                    // try to save message
                    const unixTimeStamp = new Date().getTime() * 1000
                    this.SqlLiteController.insertMessageContent(messageId,
                        senderid,
                        receiverid,
                        content.text,
                        content.image as unknown as string,
                        Math.floor(unixTimeStamp)
                    )
                    this.SqlLiteController.insertMessages(receiverid, 'private', unixTimeStamp, messageId)
                    console.log('messageId:', messageId);
                } catch (error) {
                    console.error(error);
                }
                this.workerController.saveMessage(message.receiverid, MessageType.Private, {
                    content: {
                        type: 'to',
                        sendBy: senderid,
                        content: { ...content }
                    },
                    date: new Date()
                },
                    {
                        name: receivername,
                        avatar: receiveravatar,
                        userId: receiverid
                    });
                this.workerController.writeMessageList({
                    name: receivername,
                    avatar: receiveravatar,
                    userId: receiverid
                }, MessageType.Private, {
                    type: 'to',
                    sendBy: senderid,
                    content: { ...content }
                })
                resolve(true);
            });
        })
    }
    public async sendGroupMessage(to: string, message: GroupMessage): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            this?.socket.emit('group_message', {
                to,
                ...message
            }, () => {
                const { content, senderid: userId, senderavatar: avatar, sendername: userName } = message
                this.workerController.saveMessage(to, MessageType.Group, {
                    content: { type: 'to', sendBy: userId, content: { ...content } },
                    date: new Date()
                }, {
                    name: message.sendername,
                    avatar: message.senderavatar,
                    userId: message.senderid
                });
                resolve(true);
            });
        })
    }

    public async queryMessages(userId: string, type: MessageType, limit: number, offset: number) {
        const res = await this.workerController.readMessages(userId, type, limit);
        return res;
    }

    public async readMessageList() {
        this.SqlLiteController.getMessageList();
        const res = await this.workerController.readMessageList();
        const sqliteRes = this.SqlLiteController.getMessageList();
        return sqliteRes;
    }

    public async writeMessageList(info: LocalUserInfo, type: MessageType, content: LocalMessageContent) {
        await this.workerController.writeMessageList(info, type, content);
    }

    public async joinGroup(groupIds: Array<string>) {
        return new Promise<Boolean>((resolve, reject) => {
            this.socket.emit('join_group', groupIds, () => {
                resolve(true);
            });
        })
    }

    public close() {
        this?.socket?.disconnect();
        Socketio.instance = undefined;
    }
}

export { Socketio }