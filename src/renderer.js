import "./style.css";
import devtools from '@vue/devtools';
// if (process.env.NODE_ENV === 'development') {
//     devtools.connect(/* host, port */)
// }
import { createApp, watch } from 'vue';
import App from './App.vue';
import { router } from './router'
import { pinia, Socket_Info, Socket_Users, Socket_Message } from './Pinia/index'
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');

// electron event listening
window.socket.onConnect((socketid) => {
    // store current socketid in node main
    Socket_Info().Socket_ID = socketid;
    console.log('debug: got socketid: \n', socketid);
})

window.socket.onUserMap((map) => {
    Socket_Users().usermap = map;
    console.log('debug: got usermap: \n', map);
})

window.socket.onUserConnected((newUser) => {
    // store new user into usermap
    console.log('debug: got new user: ', newUser);
    Socket_Users().usermap.set(newUser.userid, newUser);
})

window.socket.onUserDisconnected((userid) => {
    console.log('debug: user disconnect.', userid);
    Socket_Users().usermap.delete(userid);
})

window.socket.onPrivateMessage((msg) => {
    const message = Socket_Message().messages;
    if (!message.has(msg.senderid)) {
        message.set(msg.senderid, { data: [], total: 0 });
    }
    const target = message.get(msg.senderid);
    target.data.push({
        type: 'from',
        content: msg.content,
        date: new Date()
    })
    target.total = target.data.length;
})