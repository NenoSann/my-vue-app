export type LocalUserIndex = {
    name: string,
    avatar: string,
    userId: string,
    messageCounts: number,
    type: MessageType
}

export enum MessageType {
    Private = 'private',
    Group = 'group'
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
    date: string
}