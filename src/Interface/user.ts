export type SocketUserInfo = {
    avatar: string,
    username: string,
    socketid: string,
    userid: string,
}

export interface IUser {
    _id: string,
    name: string,
    email: string,
    avatar: string,
    friends: Array<IFriend>,
    groups: string[],
    __v: number
}

export interface IFriend {
    name: string,
    userid: string,
    avatar: string,
    online: boolean
}

export type PrivateMessage = {
    content: MessageContent,
    receiverid: string,
    senderid: string,
    sendername: string,
    senderavatar: string
}

export type MessageContent = {
    text: string,
    image?: Array<string>
}