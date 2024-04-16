import { Worker } from 'node:worker_threads';
// const { parentPort, Worker } = require('node:worker_threads');
import { LocalMessageContent, LocalMessageList, LocalUserIndex, LocalUserInfo, MessageType } from '../Interface/NodeLocalStorage';
export class WorkerController {
    worker: Worker;
    constructor() {
        this.worker = new Worker('./src/Node_Util/worker.js');
    }

    public saveMessage(userId: string, type: MessageType, content: {
        content: LocalMessageContent,
        date: Date
    }, userInfo: LocalUserInfo) {
        this.worker.postMessage({
            operateType: 'writeMessage',
            type,
            content: {
                userId,
                content,
                userInfo
            }
        })
    }

    public readMessages(userId: string, type: MessageType, limit: number): Promise<{
        messages: string[],
        userInfo: LocalUserIndex | null | undefined
    }> {
        return new Promise((resolve, reject) => {
            // create a once event listener
            // and close the listener after worker post
            const messageHandler = (data: {
                type: 'readMessage' | 'write' | 'error',
                content: {
                    messages: Array<string>,
                    userInfo: Array<LocalUserIndex> | LocalUserIndex | null | undefined
                }
            }) => {
                if (data.type === 'readMessage') {
                    let res: any = {};
                    const { messages, userInfo } = data.content;
                    Object.assign(res, { messages, userInfo })
                    resolve(res);
                    this.worker.off('message', messageHandler);
                } else if (data.type === 'error') {
                    reject(new Error('error at readMessages'));
                    this.worker.off('message', messageHandler);
                }
            };
            this.worker.on('message', messageHandler);

            this.worker.postMessage({
                operateType: 'readMessage',
                type,
                content: {
                    userId,
                    limit,
                },
            });
        });
    }

    public writeMessageList(info: LocalUserInfo, type: MessageType, content: LocalMessageContent): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const messageHandler = (state: boolean) => {
                if (state) {
                    resolve(true);
                } else {
                    resolve(false);
                }
                this.worker.off('message', messageHandler);
            }
            this.worker.on('message', messageHandler);
            this.worker.postMessage({
                operateType: 'writeMessageList',
                content: {
                    info, type, content
                }
            })
        })
    }

    public readMessageList(): Promise<Array<LocalMessageList>> {
        return new Promise<Array<LocalMessageList>>((resolve, reject) => {
            const messageHandler = (res: Array<LocalMessageList>) => {
                resolve(res);
                this.worker.off('message', messageHandler);
            }
            this.worker.on('message', messageHandler);
            this.worker.postMessage({
                operateType: 'readMessageList',
                content: {}
            })
        })
    }

    private _logMessages(content: Array<string>) {
        console.log('got read messages: \n', content);
    }
}