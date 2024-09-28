// This file is deprecated, it used to be a web-side socket.io client, but now I move
// the socket.io client into electron main process, but this file remain, reuse it when
// neccessary
//
/**
 * @deprecated
 */
import {
    pinia,
    User,
    Socket_Users,
    Socket_Target,
    Socket_Message,
} from "../Pinia";
import { io } from "socket.io-client";
const user = User(pinia);
const SocketUsers = Socket_Users(pinia);
const SocketMessage = Socket_Message();
const socket = io("http://43.163.234.220:8081", {
    auth: {
        username: user.name,
        id: user._id,
        avatar: user.avatar,
    },
    autoConnect: false,
});
socket.on("connect", () => {
    console.log(`socket is ${socket.connected}`);
});
socket.on("users", (data: string) => {
    // when server send usermap we replace it;
    SocketUsers.usermap = new Map(JSON.parse(data));
    if (SocketUsers.usermap.get(user._id) !== undefined) {
        // what type ?
        (
            SocketUsers.usermap.get(user._id) as {
                avatar: string;
                username: string;
                socketid: string;
                userid: string;
            }
        ).username = "You";
    }
    console.log("users data: ", new Map(JSON.parse(data)));
});
socket.on("user_connected", (data: any) => {
    console.log("user_connected", data);
    SocketUsers.usermap.set(data.userid, data.userInfo);
    console.log("now the usermap is :", SocketUsers.usermap);
});

socket.on("user_disconnect", (userid: string) => {
    console.log("user_disconnect", userid);
    SocketUsers.usermap.delete(userid);
    console.log("now the usermap is :", SocketUsers.usermap);
});

socket.on(
    "private_message",
    (data: {
        content: string;
        from: string;
        senderid: string;
        sendername: string;
        senderavatar: string;
    }) => {
        console.log("got private message : ", data);
        if (!SocketMessage.messages.has(data.senderid)) {
            SocketMessage.messages.set(data.senderid, { data: [], total: 0 });
        }
        SocketMessage.messages.get(data.senderid)?.data.push({
            type: "to",
            content: data.content,
            date: new Date(),
        });
        SocketMessage.messages.get(data.senderid)!.total += 1;
    },
);
export { socket };
