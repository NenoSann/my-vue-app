<template>
    <div
        v-if="props.show"
        class="daisy-radial-progress absolute-center"
        :style="{ '--value': props.percent }">
        {{ props.percent + "%" }}
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    percent: number;
    show: boolean;
}>();
</script>
