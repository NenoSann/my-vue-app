<template>
    <div class="home-main">
        <SideBar></SideBar>
        <!-- <Channel></Channel> -->
        <UserHome></UserHome>
        <!-- <UserHome></UserHome> -->
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import SideBar from '../component/SideBar.vue';
import UserHome from '../component/UserHome.vue';
import { useRoute } from 'vue-router';
import { socket } from '../Socket.io';
const route = useRoute();
onMounted(() => {
    socket.connect();
})
</script>

<style scoped>
.home-main {
    @apply flex flex-row;
    @apply w-screen h-screen;
}
</style>