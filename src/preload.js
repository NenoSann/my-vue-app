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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
var electron_1 = require("electron");
var fs = require("fs");
var path = require("path");
electron_1.contextBridge.exposeInMainWorld("versions", {
    node: function () { return process.versions.node; },
    chrome: function () { return process.versions.chrome; },
    electron: function () { return process.versions.electron; },
    author: "NenoSan",
    ping: function () { return electron_1.ipcRenderer.invoke("ping"); },
});
/**
 *  In this section we expose apis that let webpage access node environment,
 *  after adding new functions we need to add declaration in preload.d.ts to
 *  make typescript work
 */
electron_1.contextBridge.exposeInMainWorld("socket", {
    // From webpage to main thread
    createSocket: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            electron_1.ipcRenderer.invoke.apply(electron_1.ipcRenderer, __spreadArray(["socket:create"], args, false));
            return true;
        }
        catch (error) {
            console.error(error);
        }
    },
    joinGroup: function (groupIds, userId, userName, userAvatar) {
        return electron_1.ipcRenderer.invoke("socket:joinGroup", {
            groupIds: groupIds,
            userId: userId,
            userName: userName,
            userAvatar: userAvatar,
        });
    },
    getUserMap: function () { return electron_1.ipcRenderer.invoke("socket:getUserMap"); },
    close: function () { return electron_1.ipcRenderer.send("socket:close"); },
    sendPrivateMessage: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return electron_1.ipcRenderer.invoke.apply(electron_1.ipcRenderer, __spreadArray(["socket:privateMessage"], args, false));
    },
    sendGroupMessage: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            electron_1.ipcRenderer
                .invoke.apply(electron_1.ipcRenderer, __spreadArray(["socket:groupMessage"], args, false)).then(function () { return resolve(true); })
                .catch(function () { return reject(); });
        });
    },
    queryMessages: function (userId, targetId, type, limit, offset) {
        return new Promise(function (resolve, reject) {
            electron_1.ipcRenderer
                .invoke("socket:queryMessages", userId, targetId, type, limit, offset)
                .then(function (res) { return resolve(res); })
                .catch(function () { return reject(); });
        });
    },
    writeMessageList: function (info, type, content) {
        return new Promise(function (resolve, reject) {
            electron_1.ipcRenderer
                .invoke("socket:writeMessageList", info, type, content)
                .then(function () {
                resolve();
            })
                .catch(function () { return reject(); });
        });
    },
    readMessageList: function () {
        return new Promise(function (resolve, reject) {
            electron_1.ipcRenderer
                .invoke("socket:readMessageList")
                .then(function (res) {
                resolve(res);
            })
                .catch(function () { return reject(); });
        });
    },
    // From main thread to webpage
    onConnect: function (callback) {
        return electron_1.ipcRenderer.on("connect", function (_event, val) { return callback(val); });
    },
    onUserConnected: function (callback) {
        return electron_1.ipcRenderer.on("userConnected", function (_event, val) {
            callback(val);
        });
    },
    onUserDisconnected: function (callback) {
        return electron_1.ipcRenderer.on("userDiconnected", function (_event, val) { return callback(val); });
    },
    onClose: function (callback) {
        return electron_1.ipcRenderer.on("close", function (_event, val) { return callback(val); });
    },
    onUserMap: function (callback) {
        return electron_1.ipcRenderer.on("usermap", function (_event, usermap) { return callback(usermap); });
    },
    onPrivateMessage: function (callback) {
        return electron_1.ipcRenderer.on("privateMessage", function (_event, from, message) {
            return callback(from, message);
        });
    },
    onUserGroupMessage: function (callback) {
        return electron_1.ipcRenderer.on("userGroupMessage", function (_event, data) { return callback(data); });
    },
});
electron_1.contextBridge.exposeInMainWorld("urlAPI", {
    openURL: function (url) {
        electron_1.ipcRenderer.invoke("url:openURL", url);
    },
});
electron_1.contextBridge.exposeInMainWorld("emoji", {
    openNativeEmoji: function () {
        electron_1.ipcRenderer.invoke("openEmojiPanel");
    },
    addEmoji: function (md5, remoteAdd) {
        electron_1.ipcRenderer.invoke("emoji:addEmoji", md5, remoteAdd);
    },
    getEmojis: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, electron_1.ipcRenderer.invoke("emoji:getEmojis")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
