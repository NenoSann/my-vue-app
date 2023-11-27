<template>
    <div class="login-main flex justify-center items-center bg-teal-400 text-white border-white">
        <div
            class="login-form flex items-center justify-evenly flex-col w-3/5 h-3/4 px-4 backdrop-blur-sm rounded-xl border-2 max-w-xl">
            <p class=" font-bold text-4xl font-['Popins']  select-none my-6">Login</p>
            <input type="text"
                class=" email-input daisy-input border-2 border-white  daisy-input-ghost w-4/5 transition-all duration-500 rounded-3xl placeholder:text-white "
                placeholder="EMAIL" />
            <input type="password"
                class=" password-input daisy-input border-2 border-white  daisy-input-ghost w-4/5 transition-all duration-500 rounded-3xl placeholder:text-white -mt-6"
                placeholder="PASSWORD" />
            <div class="option w-full -my-6">
                <div class="flex justify-around items-center font-light">
                    <div class="daisy-form-control">
                        <label class="daisy-label cursor-pointer">
                            <input type="checkbox"
                                class="daisy-checkbox daisy-checkbox-sm border-white [--chkbg:#fff] [--chkfg:#fff" />
                            <span class="daisy-label-text text-white">Remember me</span>
                        </label>
                    </div>
                    <p class=" text-[0.875rem] cursor-pointer">Forget Password?</p>
                </div>
            </div>
            <button class="daisy-btn w-4/5 rounded-3xl bg-white text-black hover:text-white">
                login
            </button>
            <p class=" text-sm font-light -my-6">Don't have an account? <span
                    class=" font-normal cursor-pointer">Register</span>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { login } from '../API/user';
import { User } from '../Pinia';
import { Window } from '../Interface/preload'
const loginInfo = ref();
const user = User();
onMounted(async () => {
    loginInfo.value = await login('lianghengcn@gmail.com', '2440060505');
    user.login('lianghengcn@gmail.com', '2440060505');
    await (window as Window).storeUserInfo.save(JSON.stringify(user.$state));
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.login-main {
    @apply h-screen w-screen;
    background-image: url('../../assets/login_bg.png');
    background-size: cover;
}
</style>