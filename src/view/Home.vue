<template>
    <div class="home-main" @click="unmountContextMenu">
        <SideBar></SideBar>
        <UserHome></UserHome>
    </div>
</template>

<script setup lang="ts">
import SideBar from '../component/SideBar.vue';
import UserHome from '../component/UserHome.vue';
import { unmountContextMenu } from '../util/context_menu';
</script>

<style scoped>
.home-main {
    @apply flex flex-row;
    @apply w-screen h-screen;
}
</style>