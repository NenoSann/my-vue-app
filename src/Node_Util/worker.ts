/**
 *  这个模块用来管理electron本地的聊天记录的存储和读取, 它使用一个map来管理一个userID => {wStream,rStream}的关系,  
 *  通过判断mainThread通过postMessage中附带的类别和data来进行读取/储存用户发送的内容, 并通过postMessage方法来和mainThread沟通
 *  
 *  存储结构:
 *  message:
 *      |   'id1'
 *      |   'id2'
 *              ...
 *  因为考虑到简单性以及不会有那么多信息储存, 使用单文件来存储使用者和各个用户之间的信息, 每个信息储存的形式为JSON.stringfy(), 并且隔行用"\n"分隔
 *  在编译的时候请将ESM的import切换为上面的CJS引入
 */
// const { parentPort } = require('node:worker_threads');
// const fs = require('node:fs');
// const stream = require('node:stream/promises');
// const readline = require('readline');
// const path = require('node:path');
import { parentPort, isMainThread } from 'node:worker_threads';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as stream from 'node:stream/promises';
import * as readline from 'readline';
import type { PrivateMessage, MessageContent } from '../Interface/user';
const cwd = process.cwd();
const NEW_LINE_CHARACTERS = ["\n"];
const _path = path.join(cwd, 'message');
console.log('worker thread active!!!');
console.log('Is main thread? ', isMainThread);
const map = new Map<string, {
    rStream: fs.ReadStream,
    wStream: fs.WriteStream,
    // rStream: any,
    // wStream: any,
}>();


parentPort?.on('message', (data) => {
    console.log('got message from main thread: ', data);
    const operateType = data.type;
    const content = data.content;
    switch (operateType) {
        case 'read':
            readMessage(content.userId, data.limit);
            break;
        case 'write':
            console.log('worker.ts got message: \n', data);
            writeMessage(content.userId, content.content);
            break;
        case 'init':
            createStream(content.userId);
        default:
            break;
    }
})


/**
 * @description create wStream and rStream for target user, and store in map
 * @param userID id use to open target chat file 
 */
async function createStream(userID: string) {
    if (!map.has(userID)) {
        const userPath = path.join(_path, userID);
        if (!fs.existsSync(userPath)) {
            await createUserFile(userPath);
        }
        try {
            const rStream = fs.createReadStream(userPath);
            const wStream = fs.createWriteStream(userPath, { flags: 'a' });
            map.set(userID, { rStream, wStream });
        } catch (error) {
            handleFsError(error);
        }
    }
}

async function writeMessage(userID: string, content: any) {
    try {
        if (!map.has(userID)) {
            createStream(userID);
        }
        const { wStream } = map.get(userID) as {
            // rStream: fs.ReadStream,
            // wStream: fs.WriteStream,
            rStream: fs.ReadStream,
            wStream: fs.WriteStream,
        };
        console.log('write content: ', content);
        wStream.write(JSON.stringify(content));
        wStream.write('\n');
    } catch (error) {
        handleFsError(error);
    }
}

async function readMessage(userID: string, limit: number = 1) {
    try {
        // const nLines = await readLastLines(path.join(_path, userID), limit);
        const nLines = await readLastLines('./test', limit);
        return nLines;
    } catch (error) {
        handleFsError(error);
    }
}

/**
 * @description use to create user's chat history
 * @param name  --the file name
 */
async function createUserFile(name: string) {
    return new Promise<boolean>((resolve, reject) => {
        const directoryPath = path.dirname(name);

        fs.mkdir(directoryPath, { recursive: true }, (err) => {
            if (err) {
                reject(err);
            } else {
                fs.open(name, 'w', (err, _file) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            }
        });
    });
}

/**
 * @description return the error to mainThread throght postMessage
 * @param error catched error in fs function
 */
function handleFsError(error) {
    parentPort?.emit('messageerror', error);
}



async function readLastLines(
    inputFilePath: string,
    maxLineCount: number,
    encoding: BufferEncoding = "utf8"
): Promise<string> {
    // 检查文件是否存在
    if (!fs.existsSync(inputFilePath)) throw new Error(`File ${inputFilePath} does not exist.`);

    // 获取文件的状态和文件句柄
    const [stat, file] = await Promise.all([
        new Promise<fs.Stats>((resolve, reject) =>
            fs.stat(inputFilePath, (err, stat) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stat);
                }
            })
        ),
        new Promise<number>((resolve, reject) =>
            fs.open(inputFilePath, "r", (err, file) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(file);
                }
            })
        ),
    ]);

    let chars = 0;
    let lineCount = 0;
    let lines = "";

    while (lines.length < stat.size && lineCount < maxLineCount) {
        // 逐个读取字符，并将其添加到 `lines` 变量中
        const nextCharacter = await readPreviousChar(stat, file, chars, encoding);
        lines = nextCharacter + lines;

        // 检查是否遇到换行符，并增加行数计数器
        if (NEW_LINE_CHARACTERS.includes(nextCharacter) && lines.length > 1) {
            lineCount++;
        }
        chars++;

        // 如果 `lines` 的长度超过文件大小，则截取末尾部分以保持与文件大小相同的长度
        if (lines.length > stat.size) {
            lines = lines.substring(lines.length - stat.size);
        }
    }

    // 如果 `lines` 的第一个字符是换行符，则移除该字符
    if (NEW_LINE_CHARACTERS.includes(lines.substring(0, 1))) {
        lines = lines.substring(1);
    }

    // 关闭文件句柄
    fs.closeSync(file);

    return lines;
}

async function readPreviousChar(
    stat: fs.Stats,
    file: number,
    currentCharacterCount: number,
    encoding: BufferEncoding = "utf-8"
): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.read(
            file,
            Buffer.alloc(1),
            0,
            1,
            stat.size - 1 - currentCharacterCount,
            (err, bytesRead, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer.toString(encoding));
                }
            }
        );
    });
}

module.exports