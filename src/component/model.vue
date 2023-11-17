<template>
    <div class=" bg-black">
        <textarea name="text" id="text" cols="30" rows="10" v-model="context"></textarea>
        <p class="text-white">{{ context }}</p>
        <div class="daisy-btn">BUTTON</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const context = ref<string>();
</script>

<style scoped></style>