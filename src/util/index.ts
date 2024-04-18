import DOMPurify from 'dompurify';
import { Socket_Target, Socket_Users } from '../Pinia';
import { MessageType } from '../Interface/NodeLocalStorage.ts';
const uriRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+)(?:\/\S*)?/g;
export function formatDate(date: Date | string): string {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export function replaceWebLinks(inputString: string) {
    const replacedString = inputString.replace(uriRegex, (match, p1) => {
        const url = match.startsWith('https') ? match : `https://${match}`;
        return `<a href="${url}" class="external-url">${match}</a>`;
    });
    return DOMPurify.sanitize(replacedString);
}

export function changeSocketTarget(avatar: string, username: string, userid: string, type: MessageType) {
    const SocketTarget = Socket_Target();
    const SocketUsers = Socket_Users();
    SocketTarget.isActive = true;
    SocketTarget.type = type;
    SocketTarget.avatar = avatar;
    SocketTarget.name = username
    SocketTarget.socketid = SocketUsers.usermap.get(userid)?.socketid as string;
    SocketTarget.userid = userid
    const fullpath = '/channels/@me'
}