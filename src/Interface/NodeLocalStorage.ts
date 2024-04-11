export type LocalUserIndex = {
    users: Array<LocalUserInfo>,
    messageCounts: number,
    type: MessageType
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