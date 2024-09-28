import {
    ItemsResponse,
    IFriend,
    MessagesResponse,
    RegisteResponse,
} from "../../Interface/Response";
import { axios } from "../index";
import { IUser } from "../../Interface/user";
const baseURL = (import.meta as any).env.DEV ? "/api" : "http://localhost:8081";

export function registe(
    username: string,
    password: string,
    email: string,
): Promise<RegisteResponse> {
    return new Promise<RegisteResponse>((resolve, reject) => {
        axios
            .post("/api/register", {
                username,
                pwd: password,
                email,
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export const login = async function (email: string, password: string) {
    return new Promise<{
        status: string;
        user: {
            data: IUser;
        };
    }>((resolve, reject) => {
        axios
            .post("/api/login", {
                email,
                password,
            })
            .then((res) => {
                console.log(res.data);
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export function queryFriends(url: string): Promise<ItemsResponse<IFriend>>;
export function queryFriends(
    userId: string,
    limit?: number,
    offset?: number,
): Promise<ItemsResponse<IFriend>>;
export async function queryFriends(
    urlOrUserId: string,
    limit?: number,
    offset?: number,
): Promise<ItemsResponse<IFriend>> {
    return new Promise((resolve, reject) => {
        if (limit === undefined && offset === undefined) {
            axios
                .get(urlOrUserId)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => reject(error));
        } else {
            axios
                .get("/api/friends/", {
                    params: {
                        userId: urlOrUserId,
                        limit,
                        offset,
                    },
                })
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        }
    });
}

export async function queryUnreadChatList(userId: string) {
    return new Promise((resolve, reject) => {
        if (userId) {
            axios
                .get(baseURL + "/queryUnreadChatList", {
                    params: {
                        userId,
                    },
                })
                .then((response) => {
                    console.log(response);
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        }
    });
}

export async function queryUnreadChats(
    userId: string,
    targetUserId: string,
    offset: number,
    limit: number,
) {
    return new Promise<MessagesResponse>(async (resolve, reject) => {
        if (userId && targetUserId) {
            axios
                .get(baseURL + "/queryUnreadChats", {
                    params: {
                        userId,
                        targetUserId,
                        offset,
                        limit,
                    },
                })
                .then((response) => {
                    console.log(response);
                    resolve(response.data);
                })
                .catch(() => reject());
        }
    });
}
