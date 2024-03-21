<template>
    <div class="daisy-chat"
        :class="{ 'daisy-chat-end': props.type === 'to', 'daisy-chat-start': props.type === 'from' }">
        <div class="daisy-chat-image daisy-avatar">
            <div class="w-10 rounded-full">
                <img alt="You" src="../../assets/icon.png" />
            </div>
        </div>
        <div class="daisy-chat-header">
            {{ name }}
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
    name: string
}>();
</script>