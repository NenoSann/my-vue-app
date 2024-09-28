<template>
    <div
        class="absolute bottom-0 right-0 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
        v-if="visible">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
    // position: 'bottomLeft' | 'bottomRight',
    duration: number;
}>();
const visible = ref<Boolean>(false);
onMounted(() => {
    visible.value = true;
    setTimeout(() => {
        visible.value = false;
    }, props.duration);
});
</script>
