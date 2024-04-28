import { SocketUserInfo } from './user'
import type { GroupMessage, PrivateMessage } from './user';
import type { LocalGroupIndex, LocalMessageContent, LocalUserIndex, MessageType, LocalMessageList, SqlMessageContent, SqlUser } from './NodeLocalStorage';
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
            queryMessages: (userId: string, targteId: string, type: MessageType, limit: number, offset: number) => Promise<{
                messages: Array<SqlMessageContent>,
                userInfo: Map<string, SqlUser>
            }>;
            sendPrivateMessage: (to: string, content: PrivateMessage) => Promise<Boolean>;
            sendGroupMessage: (to: string, content: GroupMessage) => Promise<Boolean>;
            writeMessageList: (info: LocalUserInfo, type: MessageType, content: LocalMessageContent) => Promise<void>;
            readMessageList: () => Promise<Array<LocalMessageList>>;
            onConnect: (callback: (val: any) => void) => void;
            onUserConnected: (callback: (val: any) => void) => void;
            onUserDisconnected: (callback: (val: any) => void) => void;
            onClose: (callback: (val: any) => void) => void;
            onPrivateMessage: (callback: (val: any) => void) => void;
            onUserGroupMessage: (callback: (val: any) => void) => void;
        },
        urlAPI: {
            openURL: (url: string) => void;
        },
        emoji: {
            openNativeEmoji: () => void;
            addEmoji: (md5: string, remoteAdd: string) => void;
            getEmojis: () => Array<any>;
        }
    }
}

export { Window }