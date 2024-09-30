import { createI18n } from "vue-i18n";
import { I18N_UI } from './interface/ui';
const i18n = createI18n({
    // used in composition sytle api
    legacy: false,
    locale: "cn",
    fallbackLocale: "en",
    messages: {
        cn: {
            ui: {
                user: '用户名',
                login: '登录',
                email: '邮箱',
                pwd: '密码',
                rememberme: '记住用户',
                forget: '忘记密码?',
                registe: '注册',
                hadAccount: '已经有账号了?',
                notHadAccount: '还没有账号?',

                friends: '好友',
                groups: '群聊',
                search: '搜索',
                friendReq: '好友请求'
            }
        },
        en: {
            ui: {
                user: 'User',
                login: 'Login',
                email: 'Email',
                pwd: 'Password',
                rememberme: 'Remember me',
                forget: 'Forget password?',
                registe: 'Registe',
                hadAccount: "Already got an account?",
                notHadAccount: "Don' have an account?",

                friends: 'Friends',
                groups: 'Groups',
                search: 'Search',
                friendReq: 'Friend Requests'
            }
        },
    },
});

export { i18n };
