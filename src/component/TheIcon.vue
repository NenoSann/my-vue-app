<template>
    <div class=" daisy-avatar w-full rounded-[50%] hover:rounded-2xl hover:transition-[border-radius] overflow-hidden">
        <img src="../../assets/default_avatar.webp" alt="">
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    img_url?: string,
    status?: boolean,
}>();
</script>

<style scoped></style>