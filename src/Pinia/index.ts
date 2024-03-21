import { createPinia, defineStore } from "pinia";
import { login } from "../API/user";
import type { MessageContent } from '../Interface/user';
interface user {
    _id: string,
    name: string,
    email: string,
    avatar: string,
    friends: string[],
    groups: string[],
    __v: number
}
const pinia = createPinia();
const User = defineStore('User', {
    state: () => {
        if (localStorage.getItem('user')) {
            return JSON.parse(localStorage.getItem('user') as string) as user;
        } else {
            return {} as unknown as user;
        }
    },
    actions: {
        async login(email: string, password: string) {
            try {
                const user = await login(email, password);
                console.log('user: ', user);
                this.data = user.user;
                localStorage.setItem('user', JSON.stringify(user.user));
                return user.user;
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
            Socket_ID: String || null
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
            type: '',
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
                data: {
                    type: 'from' | 'to',
                    content: MessageContent,
                    date: Date
                }[],
                user: {
                    avatar: string,
                    name: string,
                    userid: string
                },
                total: number
            }>()
        }
    },
    actions: {
        storeLocally(id: string, content: MessageContent) {
            console.log(this.$state.messages);
            if (this.$state.messages.size === 0) {
                this.$state.messages.set(id, {
                    data: [{
                        type: 'to',
                        content,
                        date: new Date()
                    }],
                    user: {
                        avatar: Socket_Users().usermap.get(id)?.avatar,
                        name: Socket_Users().usermap.get(id)?.username,
                        userid: Socket_Users().usermap.get(id)?.userid
                    },
                    total: 1
                })
            }
            this.$state.messages.get(id).data.push({
                type: 'to',
                content,
                date: new Date()
            })
        },

    }
})
export { pinia, User, Socket_Info, Socket_Users, Socket_Target, Socket_Message }