import { createPinia, defineStore } from "pinia";
import { login } from "../API/user";
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
            return null as unknown as user;
        }
    },
    actions: {
        async login(email: string, password: string) {
            try {
                const user = await login(email, password);
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

export { pinia, User }