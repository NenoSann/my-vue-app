<template>
    <div class="flex flex-col w-60 h-full py-4">
        <ul class="daisy-menu w-full">
            <li><a tabindex="1">好友</a></li>
            <li><a tabindex="2">Prime</a></li>
            <li><a tabindex="3">商店</a></li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

</script>

<style scoped></style>