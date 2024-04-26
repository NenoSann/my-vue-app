export type LocalUserIndex = {
    users: Array<LocalUserInfo>,
    message: LocalMessageList,
    messageCounts: number,
    type: MessageType,
}

export enum MessageType {
    Private = 'Private',
    Group = 'Group'
}

export type LocalUserInfo = {
    name: string,
    avatar: string,
    userId: string,
}
export type LocalMessageContent = {
    type: 'from' | 'to'
    sendBy: string,
    content: {
        text: string,
        image?: Array<string>
    },
    date?: string
}

// use a map to store LocalMessageList
export type LocalMessageList = {
    type: MessageType,
    info: LocalUserInfo,
    content: Array<LocalMessageContent>,
    date: Date
}

export type SqlMessage = {
    id: string,
    type: MessageType,
    lastMessage: string,
    date: number
}

export type MessageListItem = {
    type: MessageType,
    info: SqlUser,
    content: SqlMessageContent,
    date: number
}

export type Messages = {
    messages: SqlMessageContent[],
    userInfo: Map<string, SqlUser>
}

export type SqlUser = {
    id: string,
    name: string,
    avatar: string
}

export type SqlMessageContent = {
    id: string,
    type: 'from' | 'to'
    sendBy: string,
    sendTo: string,
    text: string,
    image?: Array<string>,
    date?: number
}