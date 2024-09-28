<template>
    <div
        class="login-main flex justify-center items-center text-white border-white">
        <div
            class="login-form flex items-center justify-evenly flex-col w-3/5 h-3/4 px-4 backdrop-blur-sm rounded-xl border-2 max-w-xl">
            <p class="font-bold text-4xl font-['Popins'] select-none my-6">
                Login
            </p>
            <input
                type="username"
                v-model="credential.username"
                class="daisy-input input"
                placeholder="USER"
                v-if="isRegiste" />
            <input
                type="text"
                v-model="credential.email"
                class="email-input daisy-input input"
                placeholder="EMAIL" />
            <input
                type="password"
                v-model="credential.password"
                class="password-input daisy-input input -mt-6"
                placeholder="PASSWORD" />
            <div class="option w-full -my-6">
                <div class="flex justify-around items-center font-light">
                    <div class="daisy-form-control">
                        <label class="daisy-label cursor-pointer">
                            <input
                                type="checkbox"
                                class="daisy-checkbox daisy-checkbox-sm border-white [--chkbg:#fff] [--chkfg:#fff" />
                            <span class="daisy-label-text text-white"
                                >Remember me</span
                            >
                        </label>
                    </div>
                    <p class="text-[0.875rem] cursor-pointer">
                        Forget Password?
                    </p>
                </div>
            </div>
            <button
                class="daisy-btn w-4/5 rounded-3xl bg-white text-black hover:text-white"
                @click="isRegiste ? registe() : login()">
                {{ isRegiste ? 'Registe' : 'Login' }}
            </button>
            <p class="text-sm font-light -my-6">
                {{isRegiste ? 'Already got an account?' : 'Don\' have an account?'}}
                <span
                    class="font-normal cursor-pointer"
                    @click="isRegiste = !isRegiste"
                    >{{ isRegiste ? "Login" : "Registe" }}</span
                >
            </p>
        </div>
        <div
            class="flex justify-center items-center absolute z-20 w-full h-full backdrop-blur-sm"
            v-if="loading">
            <span class="daisy-loading daisy-loading-bars w-16 h-16"></span>
        </div>
    </div>
    <div
        class="back daisy-btn-circle daisy-btn-sm border-2 absolute backdrop-blur-md cursor-pointer top-4 left-4 hover:bg-gray-400 border- hover:transition-all transition-all"
        @click="router.back()"
        tabindex="0">
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path
                    d="M9.66088 8.53078C9.95402 8.23813 9.95442 7.76326 9.66178 7.47012C9.36913 7.17698 8.89426 7.17658 8.60112 7.46922L9.66088 8.53078ZM4.47012 11.5932C4.17698 11.8859 4.17658 12.3607 4.46922 12.6539C4.76187 12.947 5.23674 12.9474 5.52988 12.6548L4.47012 11.5932ZM5.51318 11.5771C5.21111 11.2936 4.73648 11.3088 4.45306 11.6108C4.16964 11.9129 4.18475 12.3875 4.48682 12.6709L5.51318 11.5771ZM8.61782 16.5469C8.91989 16.8304 9.39452 16.8152 9.67794 16.5132C9.96136 16.2111 9.94625 15.7365 9.64418 15.4531L8.61782 16.5469ZM5 11.374C4.58579 11.374 4.25 11.7098 4.25 12.124C4.25 12.5382 4.58579 12.874 5 12.874V11.374ZM15.37 12.124V12.874L15.3723 12.874L15.37 12.124ZM17.9326 13.1766L18.4614 12.6447V12.6447L17.9326 13.1766ZM18.25 15.7351C18.2511 16.1493 18.5879 16.4841 19.0021 16.483C19.4163 16.4819 19.7511 16.1451 19.75 15.7309L18.25 15.7351ZM8.60112 7.46922L4.47012 11.5932L5.52988 12.6548L9.66088 8.53078L8.60112 7.46922ZM4.48682 12.6709L8.61782 16.5469L9.64418 15.4531L5.51318 11.5771L4.48682 12.6709ZM5 12.874H15.37V11.374H5V12.874ZM15.3723 12.874C16.1333 12.8717 16.8641 13.1718 17.4038 13.7084L18.4614 12.6447C17.6395 11.8276 16.5267 11.3705 15.3677 11.374L15.3723 12.874ZM17.4038 13.7084C17.9435 14.245 18.2479 14.974 18.25 15.7351L19.75 15.7309C19.7468 14.572 19.2833 13.4618 18.4614 12.6447L17.4038 13.7084Z"
                    fill="#000000"></path>
            </g>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { User } from "../Pinia";
import { emailValidate } from "../util/validate";
import { registe as registeUser } from "../API/user";
import { Window } from "../Interface/preload";

// 响应变量数据
const router = useRouter();
const loginInfo = ref();
const user = User();
const loading = ref(false);
const credential = reactive({
    email: "",
    password: "",
    username: "",
});
const isRegiste = ref(false);

/**
 * 用户登录, 使用pinia内的action来进行登录, 同时将登录信息储存在pinia内进行全局管理  
 * **请不要直接使用api内的login函数来进行登录, 否则会造成状态不同步**
 */
const login = async function () {
    loading.value = true;
    loginInfo.value = await user.login(credential.email, credential.password);
    user.login(credential.email, credential.password).then(async (res) => {
        loginInfo.value = res;
        // await (window as Window).storeUserInfo.save(JSON.stringify(user.$state));
        router.push("/channels/@me");
    }).finally(() => {
        loading.value = false;
        
    });
};

/**
 * 注册用户, 使用api创建账号信息之后转换为登录状态
 */
const registe = async function() {
    console.log('registing')
    loading.value = true;
    const { username, email, password } = credential;
    try {
        if (username && emailValidate(email) && password) {
            registeUser(username, password, email);
        }
    } catch (error) {
        
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.login-main {
    @apply h-screen w-screen;
    background-image: url("../../assets/login_bg.png");
    background-size: cover;
}

.input {
    @apply border-2 w-4/5 rounded-3xl;
    @apply border-white;
    @apply daisy-input-ghost transition-all duration-500 placeholder:text-white;
}
</style>
