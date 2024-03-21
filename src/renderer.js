import "./style.css";
import devtools from '@vue/devtools';
// if (process.env.NODE_ENV === 'development') {
//     devtools.connect(/* host, port */)
// }
import { createApp, watch } from 'vue';
import App from './App.vue';
import { router } from './router'
import { pinia, Socket_Info, Socket_Users } from './Pinia/index'
import UserHome from "./component/UserHome.vue";
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