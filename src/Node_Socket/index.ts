const { io, Socket } = require("socket.io-client");
// import { io, Socket } from 'socket.io-client';
import { mainWindow } from "../main.ts";
import type { SocketUserInfo, PrivateMessage, MessageContent } from "../Interface/user";
import { EventEmitter } from "events";
type EventCallback = (args: any[]) => void;
const SocketURL = 'http://43.163.234.220:8081';
class Socketio {
    private static instance: Socketio | undefined;
    private socket: typeof Socket;
    private usermap: Map<string, SocketUserInfo>;
    private message: Map<string, Array<PrivateMessage>>;
    private friends: Array<SocketUserInfo>;
    private static eventEmitter: EventEmitter;

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
        Socketio.eventEmitter = new EventEmitter();
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
            mainWindow?.webContents.send('privateMessage', data);
            console.log('got private message from server');
        });
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

    public subscribe(event: string, callback: EventCallback): void {
        Socketio.eventEmitter.on(event, callback);
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
            }, () => resolve(true));
        })
    }
    public unsubscribe(event: string, callback: EventCallback): void {
        Socketio.eventEmitter.off(event, callback);
    }

    public close() {
        this?.socket?.disconnect();
        Socketio.instance = undefined;
    }
}

export { Socketio }