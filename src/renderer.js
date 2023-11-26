import "./style.css";
import devtools from '@vue/devtools';
if (process.env.NODE_ENV === 'development') {
    devtools.connect(/* host, port */)
}
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router'
import { pinia } from './Pinia/index'
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
