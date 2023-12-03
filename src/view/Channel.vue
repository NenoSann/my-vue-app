<template>
    <div class="channel-main">
        <div class="h-3/4 w-full">
            <TransitionGroup name="list">
                <div class="daisy-chat" :class="{ 'to-user': message.type === 'to', 'from-user': message.type === 'from' }"
                    v-for="message in messages" :key="message.content">
                    <div class="daisy-chat-image daisy-avatar">
                        <div class="w-10 rounded-full">
                            <img alt="You" src="../../assets/icon.png" />
                        </div>
                    </div>
                    <div class="daisy-chat-header">
                        {{ message.sendername }}
                    </div>
                    <div class="daisy-chat-bubble">{{ message.content }}</div>
                </div>
            </TransitionGroup>
        </div>
        <textarea :disabled="!SocketTarget?.isActive" class="relative daisy-textarea h-1/4 resize-none w-full rounded-none"
            v-model="input" @keyup.ctrl.enter="sendMessage"></textarea>
        <div class="daisy-btn daisy-btn-outline daisy-btn-primary absolute bottom-4 right-4 " @click="sendMessage">SEND
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { socket } from '../Socket.io/index';
import { User, Socket_Users, Socket_Target, Socket_Message } from '../Pinia';
const input = ref<string>('');
const SocketTarget = computed(() => {
    return Socket_Target().$state;
})
const SocketUsers = Socket_Users();
const SocketMessage = Socket_Message();
const user = User();
const messages = ref<{
    content: string,
    type: 'from' | 'to',
    sendername: string,
    time?: string
}[]>([]);

const sendMessage = function () {
    socket.emit('private_message', {
        content: input.value,
        to: SocketTarget.value.socketid,
        senderid: user._id,
        sendername: user.name,
        senderavatar: user.avatar
    });
    if (!SocketMessage.messages.has(user._id)) {
        SocketMessage.messages.set(user._id, []);
    }
    SocketMessage.messages.get(user._id)?.push({
        type: 'from',
        content: input.value,
        date: new Date()
    })
    messages.value.push({
        content: input.value,
        type: 'from',
        sendername: 'You'
    })
    input.value = '';
}


onMounted(() => {
    socket.on('private_message', (data: {
        content: string,
        from: string,
        senderid: string,
        sendername: string,
        senderavatar: string
    }) => {
        console.log('get private message');
        messages.value.push({
            content: data.content,
            type: 'to',
            sendername: data.sendername
        });
        console.log('from user:  ', SocketUsers.usermap.get(data.from));
    })
})

onBeforeUnmount(() => {
    // before component unmounted, close the socket connection mannuly
})
</script>

<style scoped>
.channel-main {
    /* test background */
    @apply bg-slate-200 p-2 relative;
    @apply grow;
    @apply overflow-hidden;
}

.from-user {
    @apply daisy-chat-end;
}

.to-user {
    @apply daisy-chat-start;
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