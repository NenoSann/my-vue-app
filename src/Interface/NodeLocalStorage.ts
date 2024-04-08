export type LocalUserIndex = {
    name: string,
    avatar: string,
    userId: string,
    messageCounts: number,
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
    }
}