<template>
    <div class="home-main">
        <SideBar></SideBar>
        <!-- <Channel></Channel> -->
        <UserHome></UserHome>
        <!-- <UserHome></UserHome> -->
    </div>
</template>

<script setup lang="ts">
import SideBar from '../component/SideBar.vue';
import UserHome from '../component/UserHome.vue';
</script>

<style scoped>
.home-main {
    @apply flex flex-row;
    @apply w-screen h-screen;
}
</style>