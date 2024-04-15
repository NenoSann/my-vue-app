import { ItemsResponse, IFriend } from '../../Interface/Response';
import axios from "axios";
import { IUser } from '../../Interface/user'
const baseURL = (import.meta as any).env.DEV ? '/api' : 'http://43.163.234.220:8081';

export const login = async function (email: string, password: string) {
    return new Promise<{
        status: string,
        user: {
            data: IUser
        }
    }>((resolve, reject) => {
        axios.post('/api/login', {
            email,
            password
        }).then((res) => {
            console.log(res.data);
            resolve(res.data);
        }).catch((error) => {
            reject(error);
        })
    })
}

export function queryFriends(url: string): Promise<ItemsResponse<IFriend>>;
export function queryFriends(userId: string, limit?: number, offset?: number): Promise<ItemsResponse<IFriend>>;
export async function queryFriends(urlOrUserId: string, limit?: number, offset?: number): Promise<ItemsResponse<IFriend>> {
    return new Promise((resolve, reject) => {
        if (limit === undefined && offset === undefined) {
            axios.get(urlOrUserId).then((res) => {
                resolve(res.data);
            }).catch((error) => reject(error));
        } else {
            axios.get('/api/friends/', {
                params: {
                    userId: urlOrUserId,
                    limit,
                    offset
                }
            }).then((res) => resolve(res.data)).catch((err) => reject(err));
        }
    })
}

export async function queryUnreadChats(userId: string) {
    return new Promise((resolve, reject) => {
        if (userId) {
            axios.get(baseURL + '/queryUnreadChats', {
                params: {
                    userId
                }
            }).then((response) => {
                console.log(response);
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        }
    })
}
