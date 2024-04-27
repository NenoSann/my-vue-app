import DOMPurify from 'dompurify';
import { User, Socket_Target, Socket_Message, Socket_Info, Socket_Users } from '../Pinia';
import { MessageType } from '../Interface/NodeLocalStorage.ts';
import { computed } from 'vue';
import { handleContextMenu } from './context_menu';
import type { Window } from '../Interface/preload';

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

export function scrollDiv(element: HTMLElement, type: 'top' | 'end', behavior: 'smooth' | 'instant') {
    const option = {
        left: 0,
        top: 0,
        behavior
    }
    if (type === 'end') {
        option.top = element.scrollHeight;
    }
    element.scrollTo(option);
}

export function appendImgElement(element: HTMLDivElement, base64: string[], path: string[], classes?: string[]) {
    const nodes = createImgElement(base64, path, classes);
    for (const node of nodes) {
        element.appendChild(node);
    }
}

export function createImgElement(base64: string[], path: string[], classes?: string[]): HTMLImageElement[] {
    const nodes: HTMLImageElement[] = [];
    for (const [index, img] of base64.entries()) {
        const node = document.createElement('img');
        if (classes) {
            node.classList.add(...classes);
        }
        node.addEventListener('contextmenu', (event) => {
            handleContextMenu(event);
        })
        node.src = img;
        nodes.push(node);
    }
    return nodes;
}

/**
 * 
 * @param element 替换的图片元素的父元素
 * @param locations 替换的图片的地址
 */
export function replaceImage(element: HTMLDivElement, locations: string[]) {
    if (locations.length === 0) {
        return;
    }
    let index = 0;
    for (const node of element.childNodes) {
        if (node instanceof HTMLImageElement) {
            node.src = locations[index];
            index++;
        }
    }
}

/**
 * create span element to replace the text element in given HTMLElement,
 * return the target element 
 * @param element 
 * @returns element 
 */
export function replaceTextNode(element: HTMLDivElement) {
    for (const child of element.childNodes) {
        if (Object.getPrototypeOf(child) === Text.prototype) {
            const span = document.createElement('span');
            span.innerText = (child as Text).data;
            element.replaceChild(span, child);
        }
    }
    return element;
}

export function extractImageSrc(element: HTMLDivElement) {
    const srcs: string[] = [];
    for (const [index, child] of element.childNodes.entries()) {
        if (Object.getPrototypeOf(child) === HTMLImageElement.prototype) {
            srcs.push((child as HTMLImageElement).src);
            (child as HTMLImageElement).removeAttribute('src');
        }
    }
    return {
        element,
        srcs
    }
}

export function checkUserInUsermap(userId: string) {
    const SocketUser = Socket_Users();
    return SocketUser.usermap.has(userId);
}

export function extractTextContent(htmlString: string) {
    const element = document.createElement('div');
    element.innerHTML = htmlString;
    return element.textContent;
}

export async function readFileAsDataURL(file: File) {
    return new Promise<string>((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = (result) => {
            resolve(fileReader.result as string);
        }
        fileReader.readAsDataURL(file);
    })
}

export function sendMessage(text: string, callback: Function) {
    const user = User();
    const SocketInfo = Socket_Info();
    const SocketTarget = Socket_Target();
    const SocketMessage = Socket_Message();
    const content = { text }
    const messageHeader = computed(() => ({
        from: SocketInfo.Socket_ID,
        receiverid: SocketTarget.userid,
        receiveravatar: SocketTarget.avatar,
        receivername: SocketTarget.name,
        senderid: user._id,
        sendername: user.name,
        senderavatar: user.avatar,
        to: SocketTarget.socketid
    }));

    const userInfo = computed(() => {
        return {
            avatar: user.avatar,
            name: user.name,
            userId: user._id
        }
    })
    const header = { ...messageHeader.value, content };
    const target = SocketTarget.userid;
    if (SocketTarget.type === MessageType.Private) {
        const index = SocketMessage.storeLocally(target, {
            type: 'to',
            content,
            date: new Date(),
            sendBy: user._id,
            sent: false,
        }, userInfo.value) as number;
        window.socket.sendPrivateMessage(header.to, header).then(() => {
            SocketMessage.messages.get(target)!.data[index].sent = true;
            callback();
        }
        );
    } else if (SocketTarget.type === MessageType.Group) {
        const index = SocketMessage.storeLocalGroup(target, {
            type: 'to',
            content,
            date: new Date(),
            sendBy: user._id,
            sent: false
        }, userInfo.value);
        window.socket.sendGroupMessage(header.to, header).then(() => {
            SocketMessage.messages.get(target)!.data[index].sent = true;
            callback();
        });
    }
}

export { handleContextMenu }