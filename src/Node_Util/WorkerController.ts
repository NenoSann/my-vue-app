import { Worker } from 'node:worker_threads';
// const { parentPort, Worker } = require('node:worker_threads');
import { MessageContent } from '../Interface/user';
export class WorkerController {
    worker: Worker;
    constructor() {
        this.worker = new Worker('./src/Node_Util/worker.js');
    }

    public saveMessage(userId: string, content: {
        content: MessageContent,
        date: Date
    }) {
        this.worker.postMessage({
            type: 'write',
            content: {
                userId,
                content
            }
        })
    }

    public readMessages(userId: string, limit: number): Promise<string[]> {
        return new Promise((resolve, reject) => {
            // create a once event listener
            // and close the listener after worker post
            const messageHandler = (data: {
                type: 'read' | 'write' | 'error',
                content: Array<string>
            }) => {
                if (data.type === 'read') {
                    const res = data.content.map((json) => {
                        return JSON.parse(json);
                    })
                    resolve(res);
                    this.worker.off('message', messageHandler);
                } else if (data.type === 'error') {
                    reject(new Error('error at readMessages'));
                    this.worker.off('message', messageHandler);
                }
            };

            this.worker.on('message', messageHandler);

            this.worker.postMessage({
                type: 'read',
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