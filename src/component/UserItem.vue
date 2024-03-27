<template>
    <li class="list-item" @click="() => { if (props.callback) { props.callback(avatar, name, userid) } }"
        @keypress.enter="">
        <a :tabindex="props.index">
            <div class="daisy-avatar w-12" :class="{ 'daisy-online': props.online, 'daisy-offline': !props.online }">
                <img class="rounded-full" :src="props.avatar">
            </div>
            <div class="flex flex-col">
                <p id="username">{{ name }}</p>
                <p id="lastest-message">{{ "Test message 🐱🐱🐱" }}</p>
            </div>
            <span v-if="props.unread !== ''" class="daisy-badge daisy-badge-primary">{{ props.unread }}</span>
        </a>
    </li>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Socket_Message } from '../Pinia';
const props = defineProps<{
    userid: string,
    avatar: string,
    name: string,
    index: number,
    callback: (avatar: string, username: string, userid: string) => void,
    unread: string,
    online: boolean
}>();

onMounted(() => {
    Socket_Message().clearUnread(props.userid);
})
</script>

<style scoped>
#username {
    @apply text-lg text-neutral-200;
}

.list-item {
    @apply h-16;
}

.list-item>a {
    @apply h-full;
}

.daisy-offline {
    @apply opacity-50;
}

.list-item::after {
    opacity: 0;
    top: 50%;
    transform: translateY(-50%);
    right: 12%;
    content: attr(data-unread);
    color: white;
    height: calc(1rem + 4px);
    @apply absolute flex items-center bg-gray-700 rounded-lg py-1 px-2 text-center;
}

.list-item.has-unread::after {
    opacity: 1;
}

.list-item .selected {
    @apply bg-slate-300;
}
</style>