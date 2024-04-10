import { SocketUserInfo } from './user'
import type { GroupMessage, PrivateMessage } from './user';
import type { LocalMessageContent, LocalUserIndex } from './NodeLocalStorage';
declare global {
    interface Window extends Window {
        storeUserInfo: {
            save: (data: any) => Promise<string>;
        };
        socket: {
            createSocket: (name: string, _id: string, avatar: string) => Promise<Boolean>;
            joinGroup: (groupIds: Array<string>, userId: string, userName: string, userAvatar: string) => void;
            connect: () => Promise<Boolean>;
            close: () => Promise<Boolean>;
            getUserMap: () => Promise<Map<string, SocketUserInfo>>;
            queryMessages: (userId: string, limit: number, offset: number) => Promise<{
                messages: Array<LocalMessageContent>,
                userInfo: LocalUserIndex
            }>;
            sendPrivateMessage: (to: string, content: PrivateMessage) => Promise<Boolean>;
            sendGroupMessage: (to: string, content: GroupMessage) => Promise<Boolean>;
            onConnect: (callback: (val: any) => void) => void;
            onUserConnected: (callback: (val: any) => void) => void;
            onUserDisconnected: (callback: (val: any) => void) => void;
            onClose: (callback: (val: any) => void) => void;
            onPrivateMessage: (callback: (val: any) => void) => void;
            onUserGroupMessage: (callback: (val: any) => void) => void;
        }
    }
}

export { Window }