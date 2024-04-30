<template>
    <div class="emoji-main">
        <div class="emoji-item" v-for="emoji in emojis">
            <img :src="emoji?.remoteAdd" :alt="emoji?.alt">
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const emojis = ref();
onMounted(async () => {
    const res = await window.emoji.getEmojis();
    emojis.value = res;
})
</script>

<style scoped>
.emoji-main {
    @apply flex flex-wrap content-start gap-1;
    @apply h-80 w-[32rem] max-h-80;
    /* move emoji panel to the top of icon */
    @apply translate-x-[calc(50%-24px)] -translate-y-[calc(50%+24px)];
    @apply rounded-md p-2;
    @apply absolute;
    @apply bg-neutral bg-opacity-50 backdrop-blur-lg;
}

.emoji-item {
    @apply p-2 rounded-sm;
    @apply h-24 w-24;
    @apply scale-100 hover:scale-110 backdrop-brightness-100 hover:backdrop-brightness-50 transition-all;
}

.emoji-item img {
    @apply w-full h-full;
    @apply object-contain;
}
</style>