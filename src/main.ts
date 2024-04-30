import { app, BrowserWindow, ipcMain, nativeImage, Menu, Tray, shell } from 'electron';
import * as path from 'path';
import { Socketio } from './Node_Util/index.ts';
import { GroupMessage, PrivateMessage } from './Interface/user.ts';
import { MessageType, LocalMessageContent, LocalUserInfo } from './Interface/NodeLocalStorage.ts';
import { WindowsController, DialogController, BufferController, } from './Electron';
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}
let mainWindow: BrowserWindow | undefined;
const icon = nativeImage.createFromPath('D:\\Web\\ElectronVueApp\\assets\\oie_icon.png');
let tray: Tray;
const createWindow = () => {
    // Create the browser window.
    const Store = require('electron-store');
    const store = new Store();
    const size = store.get('windowSize');
    mainWindow = new BrowserWindow({
        width: size?.width || 800,
        height: size?.height || 600,
        minHeight: 600,
        minWidth: 800,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        },
        icon: icon,
        titleBarOverlay: true,
    });
    mainWindow.on('close', (event) => {
        //@ts-ignore
        if (app.quitting as unknown as any) {
            mainWindow = undefined;
        } else {
            event.preventDefault();
            mainWindow?.hide();
        }
    })
    mainWindow.on('resize', (event) => {
        const [x, y] = mainWindow?.getSize() as number[];
        store.set('windowSize', {
            width: x,
            height: y
        })
    })
    // and load the index.html of the app.
    //@ts-ignore
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL as any) {
        //@ts-ignore
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL as any);
    } else {
        //@ts-ignore
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
};

const createTray = () => {
    tray = new Tray(icon);
    tray.on('double-click', () => {
        // mainWindow?.show();
        const windowsctl = new WindowsController();
        windowsctl.createWindow();
    })
    const contextMenu = Menu.buildFromTemplate([
        { label: '好友', type: 'normal' },
        { label: '打开面板', type: 'normal', click: () => mainWindow?.show() },
        { type: 'separator' },
        {
            label: '退出', type: 'normal', click: () => app.quit()
        }
    ]);
    tray.setContextMenu(contextMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on('ready', () => {
    createWindow();
    createTray();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin') {
    //     app.quit();
    // }
});

app.on('before-quit', () => {
    //@ts-ignore
    // the 'quitting' is self defined property
    app.quitting = true;
    Socketio.getInstance().close();
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const createSocket = async function (name: string, _id: string, avatar: string) {
    const socket = Socketio.getInstance(name, _id, avatar);
    return socket;
}

app.on('ready', () => {

    ipcMain.handle('ping', () => 'pong');
    ipcMain.handle('socket:create', (event, name, _id, avatar) => { Socketio.getInstance(name, _id, avatar) });
    ipcMain.handle('socket:getUserMap', (event, name, _id, avatar) => console.log(createSocket(name, _id, avatar)));
    ipcMain.handle('socket:privateMessage', async (_event, to: string, content: PrivateMessage) => {
        return new Promise<Boolean>((resolve, reject) => {
            Socketio.getInstance().sendPrivateMessage(to, content).then(() => {
                resolve(true);
            });
        })
    });
    ipcMain.handle('socket:groupMessage', (_event, to: string, content: GroupMessage) => {
        return new Promise<Boolean>((resolve, reject) => {
            Socketio.getInstance().sendGroupMessage(to, content).then(() => {
                console.log('main.ts resolve');
                resolve(true);
            })
        })
    });
    ipcMain.handle('socket:joinGroup', (_event, groupIds: Array<string>) => {
        console.debug('groupIds: \n', groupIds);
        Socketio.getInstance().joinGroup(groupIds)
    });
    ipcMain.handle('socket:queryMessages', (_event, userId: string, targetId: string, type: MessageType, limit: number, offset: number) => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await Socketio.getInstance().queryMessages(userId, targetId, type, limit, offset);
                resolve(res);
            } catch {
                reject();
            }
        })
    });
    ipcMain.handle('socket:readMessageList', (_event) => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await Socketio.getInstance().readMessageList();
                resolve(res);
            } catch (error) {
                reject(error);
            }
        })
    });
    ipcMain.handle('socket:writeMessageList', (_event, info: LocalUserInfo, type: MessageType, content: LocalMessageContent) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await Socketio.getInstance().writeMessageList(info, type, content);
                resolve();
            } catch (error) {
                reject();
            }
        })
    })
    ipcMain.on('socket:close', () => Socketio.getInstance()?.close());

    // url api handler
    ipcMain.handle('url:openURL', (_event, url: string) => {
        shell.openExternal(url);
    })

    // oepn emoji panel
    ipcMain.handle('openEmojiPanel', () => {
        if (app.isEmojiPanelSupported()) {
            app.showEmojiPanel();
        }
    })
    ipcMain.handle('emoji:addEmoji', async (_event, md5: string, remoteAdd: string) => {
        try {
            const unixStamp = new Date().getTime() / 1000;
            let fileName = remoteAdd.split('/').at(-1) as string;
            // Socketio.getInstance().SqlLiteController.insertEmoji(md5, unixStamp, remoteAdd, 'test');
            const localAdd = await Socketio.getInstance().SqlLiteController.saveRemoteFile('emoji', remoteAdd, fileName)
            if (localAdd) {
                Socketio.getInstance().SqlLiteController.insertEmoji(md5, unixStamp, remoteAdd, localAdd);
            } else {
                Socketio.getInstance().SqlLiteController.insertEmoji(md5, unixStamp, remoteAdd, 'null');
            }
        } catch (error) {
            console.log('fail at addEmoji main');
            console.error(error);
        }
    })
    ipcMain.handle('emoji:getEmojis', () => {
        return Socketio.getInstance().SqlLiteController.getEmojis();
    })
});
export { mainWindow }