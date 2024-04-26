<template>
    <ul class="context-main daisy-menu daisy-menu-vertical [&_li>*]:rounded-sm [&_li>*]:p-1"
        :style="{ left: props.x + 'px', top: props.y + 'px' }">
        <li class="menu-item">
            <a class=" h-full">
                <Icon size="18" class="icon" tag="svg">
                    <CopyRegular />
                </Icon>
                <span>复制</span>
            </a>
        </li>
    </ul>
</template>
<script setup lang="ts">
import { CopyRegular } from '@vicons/fa';
import { Icon } from '@vicons/utils';
const props = defineProps<{
    x: number,
    y: number,

}>();
</script>
<style scoped>
.context-main {
    @apply flex flex-col w-24;
    @apply p-1 rounded-sm;
    @apply absolute z-10;
    @apply pointer-events-auto;
    @apply backdrop-blur-sm bg-base-200/30;
}

:deep(.xicon .icon > span > svg > path) {
    @apply fill-primary;
}
</style>