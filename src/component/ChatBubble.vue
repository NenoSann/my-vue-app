<template>
    <div class="daisy-chat"
        :class="{ 'daisy-chat-end': props.type === 'to', 'daisy-chat-start': props.type === 'from' }">
        <div class="daisy-chat-image daisy-avatar">
            <div class="w-10 rounded-full">
                <img alt="You" :src="props.avatar" />
            </div>
        </div>
        <div class="daisy-chat-header">
            <time class=" text-xs opacity-50">{{ time }}</time>
        </div>
        <div class="daisy-chat-bubble">{{ content.text }}</div>
    </div>
</template>

<script setup lang="ts">
import type { MessageContent } from '../Interface/user';
const props = defineProps<{
    type: "to" | "from";
    content: MessageContent;
    date: Date;
    avatar: string;
    time: string
}>();
</script>