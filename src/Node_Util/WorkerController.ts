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

    public readMessages(userId: string, limit: number) {
        this.worker.postMessage({
            type: 'read',
            content: {
                userId,
                limit
            }
        })
    }

    private _logMessages(content: Array<string>) {
        console.log('got read messages: \n', content);
    }
}