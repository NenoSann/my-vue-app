import "./style.css";
import devtools from '@vue/devtools';
// if (process.env.NODE_ENV === 'development') {
//     devtools.connect(/* host, port */)
// }
import { createApp, watch } from 'vue';
import App from './App.vue';
import { router } from './router'
import { pinia, Socket_Info, Socket_Users, Socket_Message, Socket_Target, User } from './Pinia/index'
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');


const socketTarget = Socket_Target();
// electron event listening
window.socket.onConnect((socketid) => {
    // store current socketid in node main
    Socket_Info().Socket_ID = socketid;
})

window.socket.onUserMap((map) => {
    const user = User();
    Socket_Users().usermap = map;
    map.forEach((socketUser) => {
        const userid = socketUser.userid;
        // user is a map item, user[0] is userid and user[1] is socket user info
        if (user.friends.has(userid)) {
            const targetUser = user.friends.get(userid);
            targetUser.online = true;
            user.friends.set(userid, targetUser);
        }
    })
    if (Socket_Target().type === 'User') {
        socketTarget.updateSocketId();
    }
})

window.socket.onUserConnected((newUser) => {
    // store new user into usermap
    const user = User();
    Socket_Users().usermap.set(newUser.userid, newUser);
    const connectedUser = user.friends.get(newUser.userid);
    // if user's friend connected, then make it online
    if (connectedUser) {
        connectedUser.online = true;
        user.friends.set(newUser.userid, connectedUser);
    }
    if (Socket_Target().type === 'User') {
        socketTarget.updateSocketId();
    }
})

window.socket.onUserDisconnected((userid) => {
    Socket_Users().usermap.delete(userid);
    const user = User();
    const connectedUser = user.friends.get(userid);
    // if user's friend connected, then make it online
    if (connectedUser) {
        connectedUser.online = false;
        user.friends.set(userid, connectedUser);
    }
    if (Socket_Target().type === 'User') {
        socketTarget.updateSocketId();
    }
})

window.socket.onUserGroupMessage((data) => {
    console.log('got group message from server', data);
    const { content, from, senderid, senderavatar, sendername } = data;
    const SocketMessage = Socket_Message();
    const SocketTarget = Socket_Target();
    SocketMessage.storeLocalGroup(from)
    const info = {
        data: {
            type: 'from',
            content,
            date: new Date()
        },
        user: {
            name: sendername,
            avatar: senderavatar,
            userid: senderid
        },
    }
    if (!SocketMessage.has(from)) {
        SocketMessage.set(from, {
            data: [],
            user: [],
            total: 0,
            unread: 0
        })
    }
    const target = SocketMessage.get(from);
    target.data.push(info.data);
    target.user.push(info.user);
    target.total++;
    SocketTarget.userid !== from ? target.unread++ : undefined;
    SocketMessage.set(from, target);
})

window.socket.onPrivateMessage((msg) => {
    // this event will happened when nodejs socket receive the 
    // 'Private_Message' event from server, here we will store
    // the message into pinia's Socket_Message
    const SocketMessage = Socket_Message();
    const message = Socket_Message().messages;
    SocketMessage.storeLocally(msg.senderid, {
        sendBy: msg.senderid,
        type: 'from',
        content: msg.content,
        date: new Date()
    }, {
        avatar: msg.senderavatar,
        name: msg.sendername,
        userId: msg.senderid
    })
    // if (!message.has(msg.senderid)) {
    //     message.set(msg.senderid, {
    //         data: [], user: new Map(msg.senderid, {
    //             avatar: msg.senderavatar,
    //             name: msg.sendername,
    //             userid: msg.senderid
    //         }), total: 0, unread: 0
    //     });
    // }
    // const target = message.get(msg.senderid);
    // target.data.push({
    //     userId: msg.sernderid,
    //     type: 'from',
    //     content: msg.content,
    //     date: new Date()
    // })
    // target.total = target.data.length;
    // console.log('socketTargetid: ', socketTarget.userid);
    // console.log('msg sender id: ', msg.senderid);
    // if (socketTarget.userid !== msg.senderid) {
    //     target.unread += 1;
    // }
})