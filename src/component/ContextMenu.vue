<template>
    <ul class="context-main daisy-menu daisy-menu-vertical [&_li>*]:rounded-sm [&_li>*]:p-1"
        :class="{ 'sub-left': props.subLeft }" :style="{ left: props.x + 'px', top: props.y + 'px' }">
        <li v-if="props.targetType && props.targetType === 'DIV'" class="menu-item" @click="props.paste">
            <a class="h-full text-slate-200">
                <Icon size="18" class="icon" tag="svg">
                    <Paste />
                </Icon>
                <span>粘贴</span>
            </a>
        </li>
        <li v-if="props.targetType && props.targetType === 'IMG'" class="menu-item" @click="props.addEmoji">
            <a class="h-full text-slate-200">
                <Icon size="18" class="icon" tag="svg">
                    <GrinWinkRegular />
                </Icon>
                <span> 添加到表情 </span>
            </a>
        </li>
        <li class="menu-item">
            <a class="h-full text-slate-200" @click="props.copy">
                <Icon size="18" class="icon" tag="svg">
                    <CopyRegular />
                </Icon>
                <span>复制</span>
            </a>
        </li>
        <li class="menu-item">
            <a class="h-full text-slate-200" @click="props.copy">
                <Icon size="18" class="icon" tag="svg">
                    <ShareSquareRegular />
                </Icon>
                <span>转发</span>
            </a>
        </li>
    </ul>
</template>
<script setup lang="ts">
import { CopyRegular, ShareSquareRegular, GrinWinkRegular, Paste } from '@vicons/fa';
import { Icon } from '@vicons/utils';
const props = defineProps<{
    x: number,
    y: number,
    targetType: string,
    subLeft: boolean,
    copy: () => void,
    paste: () => void,
    addEmoji: () => void,
}>();

</script>
<style scoped>
.context-main {
    @apply flex flex-col w-32;
    @apply p-1 rounded-sm;
    @apply absolute z-10;
    @apply pointer-events-auto;
    @apply backdrop-blur-sm bg-base-200/30;
}

:deep(.xicon.icon > svg > path) {
    @apply !fill-slate-200;
}

.sub-left {
    @apply -translate-x-full;
}
</style>