<template>
    <div class="home-main">
        <SideBar></SideBar>
        <!-- <Channel></Channel> -->
        <component :is="cpn_name"></component>
        <!-- <UserHome></UserHome> -->
    </div>
</template>

<script setup lang="ts">
import SideBar from '../component/SideBar.vue';
import Channel from './Channel.vue';
import UserHome from '../component/UserHome.vue';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const cpn_name = computed(() => {
    const path = route.fullPath.split('/');
    if (path[path.length - 1] === '@me') {
        return UserHome;
    } else {
        return Channel;
    }
})
</script>

<style scoped>
.home-main {
    @apply flex flex-row;
    @apply w-screen h-screen;
}
</style>