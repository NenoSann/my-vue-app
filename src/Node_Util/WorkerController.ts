import { Worker } from 'node:worker_threads';
// const { parentPort, Worker } = require('node:worker_threads');
import { MessageContent } from '../Interface/user';
export class WorkerController {
    worker: Worker;
    constructor() {
        this.worker = new Worker('./src/Node_Util/worker.js');
        this.worker.on('message', (data) => {
            if (data.type === 'read') {
                this._logMessages(data.content);
            }
        })
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
            const messageHandler = (data: any) => {
                if (data.type === 'read') {
                    console.log('got read messages: \n', data);
                    resolve(data.content);
                    this.worker.off('message', messageHandler);
                } else if (data.type === 'error') {
                    reject(new Error(data.content));
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