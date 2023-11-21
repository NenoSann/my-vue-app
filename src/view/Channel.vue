<template>
    <div class="channel-main">
        <div class="h-3/4 w-full">
            <div class="daisy-chat daisy-chat-start gap-4">
                <TransitionGroup name="list">
                    <div class="daisy-chat-bubble" v-for="message in messages" :key="message">
                        <p>{{ message }}</p>
                    </div>
                </TransitionGroup>
            </div>
        </div>
        <textarea class="relative daisy-textarea h-1/4 resize-none w-full rounded-none" v-model="input"></textarea>
        <div class="daisy-btn daisy-btn-outline daisy-btn-primary absolute bottom-4 right-4 " @click="sendMessage">SEND
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { io } from 'socket.io-client';
const input = ref<string>('');
const messages = ref<string[]>([]);
const socket = io('http://43.163.234.220:8080');
const sendMessage = function () {
    socket.emit('message', input.value);
    input.value = '';
}
onMounted(() => {
    socket.on('connect', () => {
        console.log(`socket is ${socket.connected}`);
    });
    socket.on('message', (args: any) => {
        messages.value.push(args);
    })
})
</script>

<style scoped>
.channel-main {
    /* test background */
    @apply bg-slate-200 p-2 relative;
    @apply grow;
    @apply overflow-hidden;
}

.list-move,
/* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.list-leave-active {
    position: absolute;
}
</style>