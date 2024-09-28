import { createRouter, createWebHistory } from "vue-router";
import Home from "../view/Home.vue";
import Login from "../view/Login.vue";
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "homePage",
            component: Home,
        },
        {
            path: "/login",
            name: "loginPage",
            component: Login,
        },
        {
            path: "/channels/@me/:userid",
            name: "myHomePageWithUser",
            component: Home,
        },
        {
            path: "/channels/@me",
            name: "myHomePage",
            component: Home,
        },
    ],
});

export { router };
