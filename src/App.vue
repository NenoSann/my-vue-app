<template>
    <div id="app">
        <RouterView>
        </RouterView>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router'
import { User } from './Pinia';
import { Window } from './Interface/preload'
const userLoginInfo = computed(() => {
    const user = User();
    console.log('computed Userinfo changed: \n', {
        name: user.name,
        _id: user._id,
        avatar: user.avatar
    })
    if (user?._id) {
        return {
            name: user.name,
            _id: user._id,
            avatar: user.avatar
        }
    }
})

watch(userLoginInfo, (newInfo) => {
    if (newInfo?.name && newInfo.avatar && newInfo._id) {
        window.socket.close();
        window.socket.createSocket(newInfo.name, newInfo._id, newInfo.avatar);
    }
}, { immediate: true })

const router = useRouter();
onMounted(() => {
    if (localStorage.getItem('user') === null) {
        router.push('/login');
    } else {
        router.push('/channels/@me')
    }
})
</script>
<style scoped>
#app {
    @apply flex flex-row;
    @apply h-screen w-screen;
}
</style>