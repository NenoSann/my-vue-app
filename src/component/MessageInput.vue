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
                <label for="image-file" class="w-full h-full flex items-center justify-center">
                    <Icon size="22">
                        <FileImageRegular />
                    </Icon>
                </label>
                <input ref="imageInput" style="display: none" type="file" id="image-file" name="image-file"
                    accept="image/png, image/jpeg, image/gif" multiple @change="handleImageClick">
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
import { sendMessage, createImgElement, readFileAsDataURL, appendImgElement } from '../util';
import { cos } from '../util/Cos&STS';
import type { Window } from '../Interface/Global'
const emits = defineEmits(['update:scroll']);
const props = defineProps<{
    disabled: boolean
}>()
const imageInput: Ref<HTMLInputElement | undefined> = ref();
const images: string[] = [];
const contentRef: Ref<HTMLDivElement> = ref() as Ref<HTMLDivElement>;

const handleClick = () => {
    const callback = () => {
        emits('update:scroll')
    }
    // sendMessage((contentRef.value as HTMLDivElement).innerHTML as string, callback);
    cos.putImage(imageInput.value?.files as FileList);
    (contentRef.value as HTMLDivElement).textContent = '';
}

const handleImageClick = async () => {
    const files = imageInput.value?.files as FileList;
    const promiseArr: Promise<string>[] = [];
    for (const image of files) {
        promiseArr.push(readFileAsDataURL(image));
    }
    images.push(...(await Promise.all(promiseArr)));
    console.log(images);
    appendImgElement(contentRef.value, images, [], ['div-img']);
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

:deep(.sidebar-icon > label> span > svg) {
    @apply hover:fill-primary;
}

/* change the xicon fill */
:deep(.sidebar-icon > span > svg > path) {
    @apply fill-inherit;
    @apply transition-all;
}

:deep(.sidebar-icon > label >span > svg > path) {
    @apply fill-inherit;
    @apply transition-all;
}
</style>