<template>
    <div class="icon-main daisy-avatar w-full transition-all hover:transition-[border-radius] overflow-hidden">
        <img src="../../assets/default_avatar.webp" alt="">
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    img_url?: string,
    status?: boolean,
}>();
</script>

<style scoped>
.icon-main:not(:hover) {
    @apply rounded-[50%];
}

.icon-main:hover {
    @apply rounded-2xl;
}
</style>