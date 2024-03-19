import { IpcMain } from "electron";
const Socketio = require("../Node_Socket");

const root = 'socket';
// in this ipc channel the main channel main is 'socket'
function channelRegister(ipcMain: IpcMain) {
    ipcMain.handle(`${root}:getUserMap`, () => Socketio.getInstance().getUserMap());
    ipcMain.handle(`${root}:create`, (_event, name, _id, avatar) => { Socketio.getInstance(name, _id, avatar) });
}

export { channelRegister };