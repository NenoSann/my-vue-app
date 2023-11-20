<template>
    <div class=" daisy-avatar w-full">
        <img class="rounded-md" src="../../assets/default_avatar.webp" alt="">
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    img_url?: string,
    status?: boolean,
}>();
</script>

<style scoped></style>