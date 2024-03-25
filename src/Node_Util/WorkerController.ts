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
}