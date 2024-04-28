<template>
    <div class="h-[calc(30%-3rem)] bg-base-200 relative">
        <div class="btn-section">
            <div class="sidebar-icon" @click="handleEmojiClick">
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
        <RadialProgress :percent="progress.percent" :show="progress.show"></RadialProgress>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref, reactive, onMounted } from 'vue';
import { GrinTongueRegular, FileRegular, FileImageRegular } from '@vicons/fa';
import { Icon } from '@vicons/utils';
import { sendMessage, readFileAsDataURL, appendImgElement, replaceImage, handleContextMenu } from '../util';
import { RadialProgress } from './';
import { cos } from '../util/Cos&STS';
import DOMPurify from 'dompurify';
import type { Window } from '../Interface/Global'
const emits = defineEmits(['update:scroll']);
const props = defineProps<{
    disabled: boolean
}>()
const imageInput: Ref<HTMLInputElement | undefined> = ref();
const contentRef: Ref<HTMLDivElement> = ref() as Ref<HTMLDivElement>;
const progress = reactive({
    percent: 0,
    show: false,
})

const handleClick = async () => {
    const callback = () => {
        emits('update:scroll')
        setTimeout(() => {
            progress.show = false;
            progress.percent = 0;
        }, 500)
    }
    const locations = await cos.putImages(imageInput.value?.files as FileList,
        (percent: number, _speed: number) => {
            //showing progress in progress
            progress.percent = percent;
            progress.show = true;
        },
    );
    replaceImage(contentRef.value, locations);
    console.log(contentRef.value.innerHTML);
    sendMessage((contentRef.value as HTMLDivElement).innerHTML as string, callback);
    (contentRef.value as HTMLDivElement).textContent = '';
}

const handleImageClick = async () => {
    const files = imageInput.value?.files as FileList;
    const promiseArr: Promise<string>[] = [];
    for (const image of files) {
        promiseArr.push(readFileAsDataURL(image));
    }
    const images: string[] = [];
    images.push(...(await Promise.all(promiseArr)));
    console.log(images);
    appendImgElement(contentRef.value, images, [], ['div-img']);
}

const handleEmojiClick = () => {
    window.emoji.openNativeEmoji();
}

onMounted(() => {
    contentRef.value.addEventListener('contextmenu', (event) => {
        handleContextMenu(event);
    })
    // custom paste event, purify the dom string that user copied
    //https://stackoverflow.com/questions/55774733/how-to-modify-copied-text-before-pasting-using-javascript
    contentRef.value.addEventListener('paste', (event) => {
        event.preventDefault();
        let selectedHTMLString = event.clipboardData?.getData('text/html');
        if (selectedHTMLString) {
            selectedHTMLString = DOMPurify.sanitize(selectedHTMLString, { FORBID_ATTR: ['style'] })
        }
        // use setTimeout to avoid recursivelly call document.execCommand
        // see: https://github.com/nwjs/nw.js/issues/3403
        setTimeout(function () {
            document.execCommand('insertHTML', false, selectedHTMLString);
        }, 0)
    })
})
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