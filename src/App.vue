<template>
    <div id="app">
        <RouterView>
        </RouterView>
        <Popup :duration="5000">
            <div role="alert" class="daisy-alert daisy-alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="stroke-current shrink-0 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>New software update available.</span>
            </div>
        </Popup>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
import Popup from './component/Popup.vue';
import type { Window } from './Interface/preload'
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