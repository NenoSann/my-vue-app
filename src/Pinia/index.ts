import { createPinia, defineStore } from "pinia";
import { login } from "../API/user";
import type { MessageContent } from '../Interface/user';
import { MessageType } from "../Interface/NodeLocalStorage";

interface IFriend {
    name: string,
    userid: string,
    avatar: string,
    online: boolean
}
interface GroupResponse {
    groupName: string,
    groupAvatar: string,
    _id: string
}
interface IUser {
    _id: string,
    name: string,
    email: string,
    avatar: string,
    friends: Map<string, IFriend> | Array<IFriend>,
    groups: Array<GroupResponse>,
    __v: number
}

interface LocalMessageContent {
    type: 'to' | 'from',
    content: MessageContent,
    date: Date | string,
    sendBy: string,
    sent?: boolean
}

interface ChatUserInfo {
    avatar: string,
    name: string,
    userId: string
}

enum eSideBar {
    Friends = 'Friend',
    Groups = 'Group'
}

enum eContent {
    Channel = 'Channel'
}

const pinia = createPinia();
const User = defineStore('User', {
    state: () => {
        if (localStorage.getItem('user')) {
            const user = JSON.parse(localStorage.getItem('user') as string) as IUser;
            const friends = new Map<string, IFriend>;
            (user.friends as Array<IFriend>).forEach((friend) => {
                friends.set(friend.userid, friend);
            })
            user.friends = friends;
            return user;
        } else {
            return {
                _id: '',
                name: '',
                email: '',
                avatar: '',
                friends: null,
                groups: null,
                __v: 0
            } as unknown as IUser;
        }
    },
    actions: {
        async login(email: string, password: string) {
            try {
                const user = (await login(email, password)).user.data;
                const friends = new Map<string, IFriend>();
                user.friends.forEach((friend) => {
                    friends.set(friend.userid, friend);
                })
                Object.assign(this.$state, {
                    ...user,
                    friends
                })
                console.log('user: ', user);
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            } catch (error) {
                console.log('login fail');
                console.error(error);
            }
        }
    }
})

const Socket_Info = defineStore('Socket_Info', {
    state: () => {
        return {
            Socket_ID: ''
        }
    },
})

const Socket_Users = defineStore('Socket_Users', {
    state: () => {
        return {
            usermap: new Map<string, {
                avatar: string,
                username: string,
                socketid: string,
                userid: string
            }>()
        }
    }
})

const Socket_Target = defineStore('Socket_Target', {
    state: () => {
        return {
            isActive: false,
            type: '' as MessageType,
            socketid: '',
            avatar: '',
            name: '',
            userid: ''
        }
    },
    actions: {
        updateSocketId() {
            this.socketid = Socket_Users().usermap.get(this.userid)?.socketid;
        }
    }
})

const Socket_Message = defineStore('Socket_Message', {
    state: () => {
        return {
            messages: new Map<string, {
                data: Array<LocalMessageContent>,
                user: Map<string, {
                    avatar: string,
                    name: string,
                    userid: string
                }>,
                total: number,
                unread: number
            }>()
        }
    },
    actions: {
        storeLocally(id: string, content: LocalMessageContent | Array<LocalMessageContent>, userInfo: ChatUserInfo | Array<ChatUserInfo>): number | undefined {
            // if messages is not defined: 
            // create a messages instance
            if (!this.$state.messages.has(id)) {
                this.$state.messages.set(id, {
                    data: [],
                    user: new Map(),
                    total: 1,
                    unread: 0
                })
            }
            if (Array.isArray(content)) {
                this.$state.messages.get(id)?.data?.push(...content as Array<LocalMessageContent>);
            } else {
                this.$state.messages.get(id)?.data?.push(content as LocalMessageContent)
                return this.$state.messages.get(id)?.data?.length;
            }
            const target = this.$state.messages.get(id);
            if (Array.isArray(userInfo)) {
                userInfo.forEach((info) => target.user?.set(info.userId, info));
            } else {
                target.user?.set(userInfo.userId, userInfo)
            }
        },
        storeLocalGroup(id: string, content: LocalMessageContent, userInfo: {
            avatar: string,
            name: string,
            userId: string
        }): number {
            if (!this.$state.messages.has(id)) {
                this.$state.messages.set(id, {
                    data: [],
                    user: new Map(),
                    total: 1,
                    unread: 0
                })
            }
            const target = this.$state.messages.get(id);
            target.data?.push(content);
            target.user?.set(userInfo.userId, userInfo)
            return target.data.length;
        },
        clearUnread(id: string) {
            if (this.$state.message?.has(id)) {
                this.$state.messages.get(id).unread = 0;
            }
        }
    }
})

const MessageList = defineStore('MessageList', {
    state: () => {
        return {

        }
    }
})

const ComponentState = defineStore('ComponentState', {
    state: () => {
        return {
            sidebar: eSideBar.Friends as eSideBar | null,
            content: eContent.Channel as eContent | null
        }
    }
})
export { pinia, User, Socket_Info, Socket_Users, Socket_Target, Socket_Message, ComponentState, eSideBar, eContent, ChatUserInfo }