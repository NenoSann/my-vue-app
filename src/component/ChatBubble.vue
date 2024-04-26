<template>
    <div class="daisy-chat"
        :class="{ 'daisy-chat-end': props.type === 'to', 'daisy-chat-start': props.type === 'from' }">
        <div class="daisy-chat-image daisy-avatar">
            <div class="w-10 rounded-full">
                <img alt="You" :src="props.avatar" />
            </div>
        </div>
        <div class="daisy-chat-header">
            <span v-if="props.name">{{ props.name }}</span>
        </div>
        <div class="daisy-chat-footer">
            <time class=" text-xs opacity-50">{{ time }}</time>
        </div>
        <div class="daisy-chat-bubble relative" @contextmenu="handleContextMenu">
            <p v-html="props.content.text" ref="pNodeRef"></p>
            <span v-if="props.loading"
                class="daisy-loading daisy-loading-ring daisy-loading-lg absolute absolute-center"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { replaceWebLinks } from '../util';
import { handleContextMenu } from '../util/context_menu';
import type { MessageContent } from '../Interface/user';
import { ref, Ref, VNodeRef, onMounted } from 'vue';
const pNodeRef: Ref<VNodeRef | null> = ref(null);
const props = defineProps<{
    type: "to" | "from";
    content: MessageContent;
    avatar: string;
    time: string;
    name?: string;
    loading?: boolean
}>();
onMounted(() => {
    (pNodeRef.value as unknown as Element).childNodes.forEach((node) => {
        // if the child node is a 'a' tag, we reset the click event 
        // of this tag
        if ((node as any).tagName === 'A') {
            node.addEventListener('click', (event) => {
                event.preventDefault();
                const href = (event.target as any).href as string;
                window.urlAPI.openURL(href);
            })
        }
    })
})
</script>

<style scope>
.absolute-center {
    @apply top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
}
</style>