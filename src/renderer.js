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
    Socket_Users().usermap = map;
    socketTarget.updateSocketId();
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
    socketTarget.updateSocketId();
})

window.socket.onUserDisconnected((userid) => {
    Socket_Users().usermap.delete(userid);
    socketTarget.updateSocketId();
})

window.socket.onPrivateMessage((msg) => {
    const message = Socket_Message().messages;
    if (!message.has(msg.senderid)) {
        message.set(msg.senderid, {
            data: [], user: {
                avatar: msg.senderavatar,
                name: msg.sendername,
                userid: msg.senderid
            }, total: 0, unread: 0
        });
    }
    const target = message.get(msg.senderid);
    target.data.push({
        type: 'from',
        content: msg.content,
        date: new Date()
    })
    target.total = target.data.length;
    console.log('socketTargetid: ', socketTarget.userid);
    console.log('msg sender id: ', msg.senderid);
    if (socketTarget.userid !== msg.senderid) {
        target.unread += 1;
    }
})