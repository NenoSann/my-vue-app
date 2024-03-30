"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
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
var node_worker_threads_1 = require("node:worker_threads");
var fs = require("node:fs");
var path = require("node:path");
var cwd = process.cwd();
var NEW_LINE_CHARACTERS = ["\n"];
var _path = path.join(cwd, 'message');
console.log('worker thread active!!!');
console.log('Is main thread? ', node_worker_threads_1.isMainThread);
var map = new Map();
node_worker_threads_1.parentPort === null || node_worker_threads_1.parentPort === void 0 ? void 0 : node_worker_threads_1.parentPort.on('message', function (data) {
    console.log('got message from main thread: ', data);
    var operateType = data.type;
    var content = data.content;
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
});
/**
 * @description create wStream and rStream for target user, and store in map
 * @param userID id use to open target chat file
 */
function createStream(userID) {
    return __awaiter(this, void 0, void 0, function () {
        var userPath, rStream, wStream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!map.has(userID)) return [3 /*break*/, 3];
                    userPath = path.join(_path, userID);
                    if (!!fs.existsSync(userPath)) return [3 /*break*/, 2];
                    return [4 /*yield*/, createUserFile(userPath)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    try {
                        rStream = fs.createReadStream(userPath);
                        wStream = fs.createWriteStream(userPath, { flags: 'a' });
                        map.set(userID, { rStream: rStream, wStream: wStream });
                    }
                    catch (error) {
                        handleFsError(error);
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function writeMessage(userID, content) {
    return __awaiter(this, void 0, void 0, function () {
        var wStream;
        return __generator(this, function (_a) {
            try {
                if (!map.has(userID)) {
                    createStream(userID);
                }
                wStream = map.get(userID).wStream;
                console.log('write content: ', content);
                wStream.write(JSON.stringify(content));
                wStream.write('\n');
            }
            catch (error) {
                handleFsError(error);
            }
            return [2 /*return*/];
        });
    });
}
function readMessage(userID, limit) {
    if (limit === void 0) { limit = 1; }
    return __awaiter(this, void 0, void 0, function () {
        var nLines, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readLastLines('./test', limit)];
                case 1:
                    nLines = _a.sent();
                    return [2 /*return*/, nLines];
                case 2:
                    error_1 = _a.sent();
                    handleFsError(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * @description use to create user's chat history
 * @param name  --the file name
 */
function createUserFile(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var directoryPath = path.dirname(name);
                    fs.mkdir(directoryPath, { recursive: true }, function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            fs.open(name, 'w', function (err, _file) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(true);
                                }
                            });
                        }
                    });
                })];
        });
    });
}
/**
 * @description return the error to mainThread throght postMessage
 * @param error catched error in fs function
 */
function handleFsError(error) {
    node_worker_threads_1.parentPort === null || node_worker_threads_1.parentPort === void 0 ? void 0 : node_worker_threads_1.parentPort.emit('messageerror', error);
}
function readLastLines(inputFilePath, maxLineCount, encoding) {
    if (encoding === void 0) { encoding = "utf8"; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, stat, file, chars, lineCount, lines, nextCharacter;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // 检查文件是否存在
                    if (!fs.existsSync(inputFilePath))
                        throw new Error("File ".concat(inputFilePath, " does not exist."));
                    return [4 /*yield*/, Promise.all([
                            new Promise(function (resolve, reject) {
                                return fs.stat(inputFilePath, function (err, stat) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(stat);
                                    }
                                });
                            }),
                            new Promise(function (resolve, reject) {
                                return fs.open(inputFilePath, "r", function (err, file) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(file);
                                    }
                                });
                            }),
                        ])];
                case 1:
                    _a = _b.sent(), stat = _a[0], file = _a[1];
                    chars = 0;
                    lineCount = 0;
                    lines = "";
                    _b.label = 2;
                case 2:
                    if (!(lines.length < stat.size && lineCount < maxLineCount)) return [3 /*break*/, 4];
                    return [4 /*yield*/, readPreviousChar(stat, file, chars, encoding)];
                case 3:
                    nextCharacter = _b.sent();
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
                    return [3 /*break*/, 2];
                case 4:
                    // 如果 `lines` 的第一个字符是换行符，则移除该字符
                    if (NEW_LINE_CHARACTERS.includes(lines.substring(0, 1))) {
                        lines = lines.substring(1);
                    }
                    // 关闭文件句柄
                    fs.closeSync(file);
                    return [2 /*return*/, lines];
            }
        });
    });
}
function readPreviousChar(stat, file, currentCharacterCount, encoding) {
    if (encoding === void 0) { encoding = "utf-8"; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs.read(file, Buffer.alloc(1), 0, 1, stat.size - 1 - currentCharacterCount, function (err, bytesRead, buffer) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(buffer.toString(encoding));
                        }
                    });
                })];
        });
    });
}
module.exports;
