"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.mainWindow = void 0;
var electron_1 = require("electron");
var path = __importStar(require("path"));
var index_ts_1 = require("./Node_Util/index.ts");
var Electron_1 = require("./Electron");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    electron_1.app.quit();
}
var mainWindow;
exports.mainWindow = mainWindow;
var icon = electron_1.nativeImage.createFromPath("D:\\Web\\ElectronVueApp\\assets\\oie_icon.png");
var tray;
var createWindow = function () {
    // Create the browser window.
    var Store = require("electron-store");
    var store = new Store();
    var size = store.get("windowSize");
    exports.mainWindow = mainWindow = new electron_1.BrowserWindow({
        width: (size === null || size === void 0 ? void 0 : size.width) || 800,
        height: (size === null || size === void 0 ? void 0 : size.height) || 600,
        minHeight: 600,
        minWidth: 800,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
        },
        icon: icon,
        titleBarOverlay: true,
    });
    mainWindow.on("close", function (event) {
        //@ts-ignore
        if (electron_1.app.quitting) {
            exports.mainWindow = mainWindow = undefined;
        }
        else {
            event.preventDefault();
            mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.hide();
        }
    });
    mainWindow.on("resize", function (event) {
        var _a = mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.getSize(), x = _a[0], y = _a[1];
        store.set("windowSize", {
            width: x,
            height: y,
        });
    });
    // and load the index.html of the app.
    // @ts-ignore
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        //@ts-ignore
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    }
    else {
        //@ts-ignore
        mainWindow.loadFile(path.join(__dirname, "../renderer/".concat(MAIN_WINDOW_VITE_NAME, "/index.html")));
    }
    mainWindow.webContents.openDevTools();
};
var createTray = function () {
    tray = new electron_1.Tray(icon);
    tray.on("double-click", function () {
        // mainWindow?.show();
        var windowsctl = new Electron_1.WindowsController();
        windowsctl.createWindow();
    });
    var contextMenu = electron_1.Menu.buildFromTemplate([
        { label: "好友", type: "normal" },
        { label: "打开面板", type: "normal", click: function () { return mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.show(); } },
        { type: "separator" },
        {
            label: "退出",
            type: "normal",
            click: function () { return electron_1.app.quit(); },
        },
    ]);
    tray.setContextMenu(contextMenu);
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on("ready", function () {
    createWindow();
    createTray();
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on("window-all-closed", function () {
    // if (process.platform !== 'darwin') {
    //     app.quit();
    // }
});
electron_1.app.on("before-quit", function () {
    //@ts-ignore
    // the 'quitting' is self defined property
    electron_1.app.quitting = true;
    index_ts_1.Socketio.getInstance().close();
});
electron_1.app.on("activate", function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
var createSocket = function (name, _id, avatar) {
    return __awaiter(this, void 0, void 0, function () {
        var socket;
        return __generator(this, function (_a) {
            socket = index_ts_1.Socketio.getInstance(name, _id, avatar);
            return [2 /*return*/, socket];
        });
    });
};
electron_1.app.on("ready", function () {
    electron_1.ipcMain.handle("ping", function () { return "pong"; });
    electron_1.ipcMain.handle("socket:create", function (event, name, _id, avatar) {
        index_ts_1.Socketio.getInstance(name, _id, avatar);
    });
    electron_1.ipcMain.handle("socket:getUserMap", function (event, name, _id, avatar) {
        return console.log(createSocket(name, _id, avatar));
    });
    electron_1.ipcMain.handle("socket:privateMessage", function (_event, to, content) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    index_ts_1.Socketio.getInstance()
                        .sendPrivateMessage(to, content)
                        .then(function () {
                        resolve(true);
                    });
                })];
        });
    }); });
    electron_1.ipcMain.handle("socket:groupMessage", function (_event, to, content) {
        return new Promise(function (resolve, reject) {
            index_ts_1.Socketio.getInstance()
                .sendGroupMessage(to, content)
                .then(function () {
                console.log("main.ts resolve");
                resolve(true);
            });
        });
    });
    electron_1.ipcMain.handle("socket:joinGroup", function (_event, groupIds) {
        console.debug("groupIds: \n", groupIds);
        index_ts_1.Socketio.getInstance().joinGroup(groupIds);
    });
    electron_1.ipcMain.handle("socket:queryMessages", function (_event, userId, targetId, type, limit, offset) {
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            var res, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, index_ts_1.Socketio.getInstance().queryMessages(userId, targetId, type, limit, offset)];
                    case 1:
                        res = _b.sent();
                        resolve(res);
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        reject();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
    electron_1.ipcMain.handle("socket:readMessageList", function (_event) {
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            var res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, index_ts_1.Socketio.getInstance().readMessageList()];
                    case 1:
                        res = _a.sent();
                        resolve(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        reject(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
    electron_1.ipcMain.handle("socket:writeMessageList", function (_event, info, type, content) {
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, index_ts_1.Socketio.getInstance().writeMessageList(info, type, content)];
                    case 1:
                        _a.sent();
                        resolve();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        reject();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
    electron_1.ipcMain.on("socket:close", function () { var _a; return (_a = index_ts_1.Socketio.getInstance()) === null || _a === void 0 ? void 0 : _a.close(); });
    // url api handler
    electron_1.ipcMain.handle("url:openURL", function (_event, url) {
        electron_1.shell.openExternal(url);
    });
    // oepn emoji panel
    electron_1.ipcMain.handle("openEmojiPanel", function () {
        if (electron_1.app.isEmojiPanelSupported()) {
            electron_1.app.showEmojiPanel();
        }
    });
    electron_1.ipcMain.handle("emoji:addEmoji", function (_event, md5, remoteAdd) { return __awaiter(void 0, void 0, void 0, function () {
        var unixStamp, fileName, localAdd, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    unixStamp = new Date().getTime() / 1000;
                    fileName = remoteAdd.split("/").at(-1);
                    return [4 /*yield*/, index_ts_1.Socketio.getInstance().SqlLiteController.saveRemoteFile("emoji", remoteAdd, fileName)];
                case 1:
                    localAdd = _a.sent();
                    if (localAdd) {
                        index_ts_1.Socketio.getInstance().SqlLiteController.insertEmoji(md5, unixStamp, remoteAdd, localAdd);
                    }
                    else {
                        index_ts_1.Socketio.getInstance().SqlLiteController.insertEmoji(md5, unixStamp, remoteAdd, "null");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.log("fail at addEmoji main");
                    console.error(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.handle("emoji:getEmojis", function () {
        return index_ts_1.Socketio.getInstance().SqlLiteController.getEmojis();
    });
});
