<template>
    <div class="h-[30%] bg-base-200">
        <div class="btn-section">
            <div class="sidebar-icon">
                <Icon size="24">
                    <GrinTongueRegular />
                </Icon>
            </div>
            <div class="sidebar-icon">
                <Icon size="22">
                    <FileRegular />
                </Icon>
            </div>
            <div class="sidebar-icon" @click="handleImageClick">
                <Icon size="22">
                    <FileImageRegular />
                </Icon>
            </div>
        </div>
        <div :spellcheck="false" :contenteditable="!props.disabled" ref="contentRef"
            class="text-area daisy-textarea h-full overflow-auto focus:outline-none">
        </div>
        <div class="daisy-btn daisy-btn-outline daisy-btn-primary absolute bottom-4 right-4" @click="handleClick">
            发送
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { GrinTongueRegular, FileRegular, FileImageRegular } from '@vicons/fa';
import { Icon } from '@vicons/utils';
import { sendMessage, createImgElement, extractImageSrc, replaceTextNode } from '../util';
import type { Window } from '../Interface/Global'
const emits = defineEmits(['update:scroll']);
const props = defineProps<{
    disabled: boolean
}>()
const image: Ref<string[]> = ref([]);
const text = ref('');
const contentRef: Ref<HTMLDivElement> = ref() as Ref<HTMLDivElement>;
const handleClick = () => {
    const callback = () => {
        emits('update:scroll')
    }
    sendMessage((contentRef.value as HTMLDivElement).innerHTML as string, callback);
    (contentRef.value as HTMLDivElement).textContent = '';
    image.value.length = 0;
}
const handleImageClick = async () => {
    const res = await window.fileAPI.getImage('Base64');
    image.value.push(...(res.base64 as string[]));
    const nodes = createImgElement(res.base64 as string[], res.imagePath, ['div-img']);
    console.log(res);
    for (const node of nodes) {
        (contentRef.value as HTMLDivElement).appendChild(node);
    }
}
</script>

<style scoped>
.btn-section {
    @apply bg-base-200;
    @apply absolute z-10;
    @apply flex items-center gap-2;
    @apply h-10 w-full px-4;
}

.text-area {
    @apply bg-base-200;
    @apply relative;
    @apply pt-8;
    @apply h-full resize-none w-full rounded-none;
    @apply focus:outline-none;
}

.sidebar-icon {
    @apply flex justify-center items-center;
    @apply h-6 w-6;
}

:deep(.sidebar-icon > span > svg) {
    @apply hover:fill-primary;
}

/* change the xicon fill */
:deep(.sidebar-icon > span > svg > path) {
    @apply fill-inherit;
    @apply transition-all;
}
</style>