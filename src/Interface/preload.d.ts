import { SocketUserInfo } from './user'
import type { PrivateMessage } from './user';
declare global {
    interface Window extends Window {
        storeUserInfo: {
            save: (data: any) => Promise<string>;
        };
        socket: {
            createSocket: (name: string, _id: string, avatar: string) => Promise<Boolean>;
            connect: () => Promise<Boolean>;
            close: () => Promise<Boolean>;
            getUserMap: () => Promise<Map<string, SocketUserInfo>>;
            sendPrivateMessage: (to: string, content: PrivateMessage) => Promise<Boolean>;
            onConnect: (callback: (val: any) => void) => void;
            onUserConnected: (callback: (val: any) => void) => void;
            onUserDisconnected: (callback: (val: any) => void) => void;
            onClose: (callback: (val: any) => void) => void;
            onPrivateMessage: (callback: (val: any) => void) => void;
        }
    }
}

export { Window }