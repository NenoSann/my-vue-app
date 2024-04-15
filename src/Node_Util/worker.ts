/**
 *  这个模块用来管理electron本地的聊天记录的存储和读取, 它使用一个map来管理一个userID => {wStream,rStream}的关系,  
 *  通过判断mainThread通过postMessage中附带的类别和data来进行读取/储存用户发送的内容, 并通过postMessage方法来和mainThread沟通
 *  
 *  存储结构:
 *  message:
 *      |   'id1'
 *      |   'id1.json'
 *      |   'id2'
 *      |   'id2.json'
 *              ...
 *  因为考虑到简单性以及不会有那么多信息储存, 使用单文件来存储使用者和各个用户之间的信息, 每个信息储存的形式为JSON.stringfy(), 并且隔行用"\n"分隔
 */
// const { parentPort } = require('node:worker_threads');
// const fs = require('node:fs');
// const stream = require('node:stream/promises');
// const readline = require('readline');
// const path = require('node:path');
import { parentPort } from 'node:worker_threads';
import * as fs from 'node:fs';
import * as fsP from 'node:fs/promises';
import * as path from 'node:path';
import * as stream from 'node:stream/promises';
import * as readline from 'readline';
import {
    LocalMessageContent,
    LocalUserIndex,
    LocalUserInfo,
    MessageType
} from '../Interface/NodeLocalStorage';
const cwd = process.cwd();
const NEW_LINE_CHARACTERS = ["\n"];
const _path = path.join(cwd, 'message');
const map = new Map<string, {
    rStream: fs.ReadStream,
    wStream: fs.WriteStream,
    indexFilePath: fs.PathLike
    index: {
        users: Map<string, LocalUserInfo>,
        messageCounts: number,
        type: MessageType
    }
}>();


parentPort?.on('message', (data: any) => {
    // check the data types in WorkerController.ts
    console.log('got message from main thread: ', data);
    const { operateType, type } = data;
    const { limit, content, userId, userInfo } = data.content;
    switch (operateType) {
        case 'read':
            readMessage(userId, type, limit).then((res) => {
                parentPort?.postMessage({
                    type: 'read',
                    content: {
                        messages: res?.messages,
                        userInfo: res?.userInfo,
                    }
                })
            });
            break;
        case 'write':
            console.log('worker.ts got message: \n', data);
            writeMessage(userId, type as MessageType, content, userInfo as LocalUserInfo);
            break;
        default:
            break;
    }
})


/**
 * @description create wStream and rStream for target user, and store in map
 * @param userID id use to open target chat file 
 */
async function createStream(userID: string, userInfo: LocalUserInfo, type: MessageType) {
    const streamPath = path.join(_path, userID);
    const indexFilePath = path.join(_path, userID + '.json');
    let isIndexNewlyCreated: Boolean = false;
    // check if streamPath and indexPath exist, if not create them
    try {
        if (!fs.existsSync(streamPath)) {
            await createUserFile(streamPath);
        }
        if (!fs.existsSync(indexFilePath)) {
            await createUserFile(indexFilePath);
            isIndexNewlyCreated = true;
        }

        // check what flags mean:
        // 'a' means for appending, and 'r+' means write and read,
        // https://nodejs.org/api/fs.html#file-system-flags
        const rStream = fs.createReadStream(streamPath);
        const wStream = fs.createWriteStream(streamPath, { flags: 'a' });
        let index = await readJSON(indexFilePath);
        // if indexFile is newly created we will try to overwrite it
        if (isIndexNewlyCreated) {
            const users = [userInfo];
            const stringfyIndex = { users, type, messageCounts: 0 }
            index = { users, type, messageCounts: 0 };
            await fsP.truncate(indexFilePath, 0)
            await fsP.writeFile(indexFilePath, JSON.stringify(stringfyIndex));
        } else {
            Object.assign(index, userInfo)
        }
        // cast the array to a map
        const userMap = new Map();
        for (const user of index.users) {
            userMap.set(user.userId, user);
        }
        index.users = userMap;
        map.set(userID, {
            // we set the default state for the user
            rStream, wStream,
            indexFilePath,
            index
        });
        console.log('first create index: ', index);
    } catch (error) {
        handleFsError(error);
    }
}

async function writeMessage(userID: string, type: MessageType, content: any, userInfo: LocalUserInfo) {
    try {
        if (!map.has(userID)) {
            await createStream(userID, userInfo, type);
        }
        console.log('write message trigger', { userID, type, content, userInfo });
        // doing type assertion because we had create those variables
        const { wStream, rStream, indexFilePath, index } = map.get(userID) as {
            rStream: fs.ReadStream,
            wStream: fs.WriteStream,
            indexFilePath: fs.PathLike
            index: {
                users: Map<string, LocalUserInfo>,
                messageCounts: number,
                type: MessageType
            }
        }

        // build updatedIndex
        // we have two index, one for memory
        // and one for disk
        index.users.set(userInfo.userId, userInfo);
        const updatedIndex = {
            users: index.users,
            type,
            messageCounts: index.messageCounts + 1
        }
        const stringfyUpdatedIndex = {
            users: Array.from(index.users.values()),
            type,
            messageCounts: index.messageCounts + 1
        }
        // store updated user index and message content into file
        // flag:'w' means overwrite the file
        await fsP.truncate(indexFilePath, 0);
        await fsP.writeFile(indexFilePath, JSON.stringify(stringfyUpdatedIndex));
        wStream.write(JSON.stringify(content));
        wStream.write('\n');
        // assign updatedIndex to map
        map.set(userID, { rStream, wStream, indexFilePath, index: updatedIndex });
        console.log('check index: ', updatedIndex);
    } catch (error) {
        handleFsError(error);
    }
}

async function readMessage(userID: string, type: MessageType, limit: number = 1) {
    try {
        // In readMessage we don't want to be complicated
        // just read and return the info
        const userPath = path.join(_path, userID);
        const indexPath = path.join(_path, userID + '.json');
        const res: {
            messages: Array<string>,
            userInfo: LocalUserIndex | null | undefined
        } = {
            messages: [],
            userInfo: null
        }
        if (fs.existsSync(userPath) && fs.existsSync(indexPath)) {
            // asyncly read the index file and parse into object
            const userInfo = JSON.parse(await (await fsP.open(indexPath, 'r')).readFile({ encoding: 'utf-8' }));
            const messages = (await readLines(userPath, limit)).map((jsonString) => {
                return JSON.parse(jsonString);
            });
            res.messages.push(...messages);
            res.userInfo = userInfo
        }
        // TODO: compile this typescript file and test the new feature
        return res;
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
function handleFsError(error: any) {
    console.error('error on worker', error);
    parentPort?.emit('messageerror', error);
}

async function readLines(inputFilePath: string, lineCounts: number): Promise<Array<string>> {
    const file = fsP.open(inputFilePath);
    const res: Array<string> = [];
    for await (const line of (await file).readLines()) {
        res.push(line);
    }
    return res;
}

async function readLastLines(
    inputFilePath: string,
    maxLineCount: number = 200,
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

async function readJSON(file: fsP.FileHandle | fs.PathLike) {
    try {
        const jsonString = await fsP.readFile(file, { encoding: 'utf-8' })
        return JSON.parse(jsonString);
    } catch (err) {
        handleFsError(err);
    }
}


module.exports