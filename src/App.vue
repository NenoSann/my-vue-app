<template>
    <div id="app">
        <SideBar></SideBar>
        <Channel></Channel>
    </div>
</template>
  
<script setup>
import SideBar from './component/SideBar.vue'
import Channel from './view/Channel.vue';
</script>
<style scoped>
#app {
    @apply flex flex-row;
    @apply h-screen w-screen;
}
</style>