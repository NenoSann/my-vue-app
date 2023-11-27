<template>
    <div id="app">
        <RouterView>
        </RouterView>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
import type { Window } from './Interface/preload'
const router = useRouter();
onMounted(() => {
    if (localStorage.getItem('user') === null) {
        router.push('/login');
    }

})
</script>
<style scoped>
#app {
    @apply flex flex-row;
    @apply h-screen w-screen;
}
</style>