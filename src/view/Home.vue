<template>
    <div class="home-main">
        <SideBar></SideBar>
    </div>
</template>

<script setup lang="ts">
import SideBar from '../component/SideBar.vue';
</script>

<style scoped>
.home-main {
    @apply flex flex-row;
    @apply w-screen h-screen;
}
</style>