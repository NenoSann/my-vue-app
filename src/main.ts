import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minHeight: 600,
        minWidth: 800,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
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
const testFs = async function (content: string) {
    console.log('test fs running')
    const targetPath = path.join(__dirname, 'user');
    fs.access(targetPath).then(async () => {
        await fs.writeFile(path.join(targetPath, 'test'), content);
        console.log('create success');
    }).catch(async (error) => {
        await fs.mkdir(targetPath);
        await fs.writeFile(path.join(targetPath, 'test'), content);
        console.log('create success');
    });
};

app.on('ready', () => {
    ipcMain.handle('testFS', async (event, data) => {
        await testFs(data);
        return `running test fs! Data: ${data}`;
    })
    ipcMain.handle('ping', () => 'pong');
});


export { testFs }