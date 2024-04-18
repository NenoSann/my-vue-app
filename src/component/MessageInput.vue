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
            <div class="sidebar-icon">
                <Icon size="22">
                    <FileImageRegular />
                </Icon>
            </div>
        </div>
        <textarea spellcheck="false" :disabled="!props.disabled" class="bg-base-200 daisy-textarea "
            v-model="text"> </textarea>
        <div class="daisy-btn daisy-btn-outline daisy-btn-primary absolute bottom-4 right-4" @click="handleClick">
            发送
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { GrinTongueRegular, FileRegular, FileImageRegular } from '@vicons/fa';
import { Icon } from '@vicons/utils';
import { sendMessage } from '../util';
const emits = defineEmits(['update:scroll']);
const props = defineProps<{
    disabled: boolean
}>()
const text = ref('');
const handleClick = () => {
    const callback = () => {
        emits('update:scroll')
    }
    sendMessage(text.value, callback);
    text.value = '';
}
</script>

<style scoped>
.btn-section {
    @apply absolute z-10;
    @apply flex items-center gap-2;
    @apply h-8 w-full px-4;
}

textarea {
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