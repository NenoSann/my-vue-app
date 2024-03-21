import { SocketUserInfo } from './user'
declare global {
    interface Window extends Window {
        storeUserInfo: {
            save: (data: any) => Promise<string>;
        };
        socket: {
            createSocket: (name: string, _id: string, avatar: string) => Promise<Boolean>;
            connect: () => Promise<Boolean>;
            getUserMap: () => Promise<Map<string, SocketUserInfo>>;
            onUserConnected: (callback: (val: any) => void) => void;
            onUserDisconnected: (callback: (val: any) => void) => void;
            onClose: (callback: (val: any) => void) => void;
        }
    }
}

export { Window }