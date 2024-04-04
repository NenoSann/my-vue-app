const { io, Socket } = require("socket.io-client");
// import { io, Socket } from 'socket.io-client';
import { mainWindow } from "../main.ts";
import type { SocketUserInfo, PrivateMessage, MessageContent, GroupMessage } from "../Interface/user.ts";
import { WorkerController } from './WorkerController';
import { NotificationController } from "../Electron/index.ts";
const SocketURL = 'http://43.163.234.220:8081';
class Socketio {
    private static instance: Socketio | undefined;
    private socket: typeof Socket;
    private usermap: Map<string, SocketUserInfo>;
    private message: Map<string, Array<PrivateMessage>>;
    private friends: Array<SocketUserInfo>;
    private workerController: WorkerController;
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
        this.friends = [];
        this.workerController = new WorkerController();

        // binding socket event here
        this.socket.on('connect', (data: any) => {
            console.log('nodejs socket client connected');
            mainWindow?.webContents.send('connect', this.socket.id);
        })
        this.socket.on('users', (data: string) => {
            // when server sends new usermap, we replace it
            console.log('got usermap from server \n', data);
            this.usermap = new Map(JSON.parse(data));
            mainWindow?.webContents.send('usermap', this.usermap);
        });

        this.socket.on('user_connected', (data: any) => {
            console.log('user connected!', data);
            this.usermap.set(data.userid, data);
            mainWindow?.webContents.send('userConnected', data.userInfo);
        });

        this.socket.on('user_disconnect', (userid: string) => {
            console.log('user disconnected! ', userid);
            this.usermap.delete(userid);
            mainWindow?.webContents.send('userDiconnected', userid);
        });

        this.socket.on('private_message', (data: PrivateMessage) => {
            if (!this.message.has(data.senderid)) {
                this.message.set(data.senderid, []);
            }
            this.message.get(data.senderid)?.push(data);
            NotificationController.sendNotification(data.content.text, data.sendername, data.senderavatar);
            mainWindow?.webContents.send('privateMessage', data);
            this.workerController.saveMessage(data.senderid, { content: data.content, date: new Date() });
            console.log('got private message from server');
        });

        this.socket.on('user_group_message', (data: GroupMessage) => {
            console.log('got user group message');
            mainWindow?.webContents.send('userGroupMessage', data);
        })
        this.socket.on('user_join_group', (data) => {
            console.log(`A user join the room ${data.userName}`);
        })
    }

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
    public sendPrivateMessage(to: string, content: PrivateMessage): Promise<Boolean> {
        // send the content to target recerver
        return new Promise<Boolean>((resolve, reject) => {
            this?.socket.emit('private_message', {
                to,
                ...content
            }, () => {
                this.workerController.saveMessage(content.receiverid, {
                    content: content.content,
                    date: new Date()
                });
                resolve(true);
            });
        })
    }
    public async sendGroupMessage(to: string, content: GroupMessage): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            console.log('sending group message to server: \n', {
                to,
                content
            })
            this?.socket.emit('group_message', {
                to,
                ...content
            }, () => {
                resolve(true);
                console.log('socket promise resolve');
                this.workerController.saveMessage(to, {
                    content: content.content,
                    date: new Date()
                });
            });
        })
    }

    public async queryMessages(userId: string, limit: number, offset: number) {
        const res = await this.workerController.readMessages(userId, limit);
        return res;
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