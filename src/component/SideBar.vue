<template>
    <div class="side-bar flex flex-col p-4">
        <TheIcon></TheIcon>
    </div>
</template>

<script setup lang="ts">
import TheIcon from './TheIcon.vue';
</script>

<style scoped>
.side-bar {
    @apply grow-0;
    @apply w-32 h-full;
    @apply bg-white;
}
</style>