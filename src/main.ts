import { app, BrowserWindow, ipcMain, nativeImage } from 'electron';
import { Worker } from 'node:worker_threads'
import * as path from 'path';
import { Socketio } from './Node_Util/index.ts';
import { PrivateMessage } from './Interface/user.ts';
// import { channelRegister } from './IPC/socket.ts';
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}
let mainWindow: BrowserWindow | undefined;

const createWindow = () => {
    // Create the browser window.
    const icon = nativeImage.createFromPath('../assets/icon.png');
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minHeight: 600,
        minWidth: 800,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        },
        icon: icon
    });

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
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

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
    ipcMain.handle('socket:groupMessage', () => { });
    ipcMain.on('socket:close', () => Socketio.getInstance()?.close());
});
export { mainWindow }