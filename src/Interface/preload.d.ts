import { SocketUserInfo } from './user'
declare global {
    interface Window {
        storeUserInfo: {
            save: (data: any) => Promise<string>;
        };
        socket: {
            createSocket: (name: string, _id: string, avatar: string) => Promise<Boolean>;
            connect: () => Promise<Boolean>;
            getUserMap: () => Promise<Map<string, SocketUserInfo>>;
        }
    }
}

export { Window }