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
    senderavatar: string,
    date: Date
}

export type GroupMessage = {
    content: MessageContent,
    senderid: string,
    sendername: string,
    senderavatar: string,
    date: Date
}

export type MessageContent = {
    text: string,
    image?: Array<string>
}

export type LocalMessageContent = {
    type: 'from' | 'to'
    sendBy: string,
    content: {
        text: string,
        image?: Array<string>
    }
}

export type LocalUserInfo = {
    userId: string,
    avatar: string,
    userName: string,
}
