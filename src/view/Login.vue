<template>
    <div class="login-main">
        {{ loginInfo }}
        {{ user }}
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { login } from '../API/user';
import { User } from '../Pinia';
const loginInfo = ref();
const user = User();
onMounted(async () => {
    loginInfo.value = await login('lianghengcn@gmail.com', '2440060505');
    user.login('lianghengcn@gmail.com', '2440060505');
    await window.storeUserInfo(JSON.stringify(user)).then;
})
</script>

<style scoped>
.login-main {
    @apply h-screen w-screen;
}
</style>