import { Worker } from 'node:worker_threads';
// const { parentPort, Worker } = require('node:worker_threads');
import { LocalMessageContent, LocalUserIndex, LocalUserInfo, MessageType } from '../Interface/NodeLocalStorage';
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
            operateType: 'write',
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
                type: 'read' | 'write' | 'error',
                content: {
                    messages: Array<string>,
                    userInfo: LocalUserIndex | null | undefined
                }
            }) => {
                if (data.type === 'read') {
                    let res;
                    res.messages = data.content.messages.map((json) => {
                        return JSON.parse(json);
                    })
                    res.userInfo = data.content.userInfo;
                    resolve(res);
                    this.worker.off('message', messageHandler);
                } else if (data.type === 'error') {
                    reject(new Error('error at readMessages'));
                    this.worker.off('message', messageHandler);
                }
            };

            this.worker.on('message', messageHandler);

            this.worker.postMessage({
                operateType: 'read',
                type,
                content: {
                    userId,
                    limit,
                },
            });
        });
    }

    private _logMessages(content: Array<string>) {
        console.log('got read messages: \n', content);
    }
}