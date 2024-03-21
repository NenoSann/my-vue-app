<template>
    <div class="daisy-chat" :class="{ 'to-user': props.type === 'to', 'from-user': props.type === 'from' }">
        <div class="daisy-chat-image daisy-avatar">
            <div class="w-10 rounded-full">
                <img alt="You" src="../../assets/icon.png" />
            </div>
        </div>
        <div class="daisy-chat-header">
            {{ name }}
        </div>
        <div class="daisy-chat-bubble">{{ content }}</div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    type: "to" | "from";
    content: string;
    date: Date;
    name: string
}>();
</script>