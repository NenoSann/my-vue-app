<template>
    <div class="side-bar flex flex-col p-3">
        <div class="me border-b-2">
            <TheIcon @click="router.push('/login')"></TheIcon>
        </div>
    </div>
</template>

<script setup lang="ts">
import TheIcon from './TheIcon.vue';
import { useRouter } from 'vue-router'
const router = useRouter();
</script>

<style scoped>
.side-bar {
    @apply grow-0;
    @apply w-20 h-full;
    @apply bg-white;
}
</style>