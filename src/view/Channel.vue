<template>
    <div class="channel-main">
        <div ref="messageRef" class="messages h-3/4 w-full pb-4 px-2 overflow-auto ">
            <TransitionGroup name="list">
                <div class="daisy-chat" :class="{ 'to-user': message.type === 'to', 'from-user': message.type === 'from' }"
                    v-for="message in messages" :key="message.content">
                    <div class="daisy-chat-image daisy-avatar">
                        <div class="w-10 rounded-full">
                            <img alt="You" src="../../assets/icon.png" />
                        </div>
                    </div>
                    <div class="daisy-chat-header">
                        {{ message.type === 'from' ? user.name : SocketTarget.name }}
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
import { ref, onMounted, onBeforeUnmount, computed, onUpdated, nextTick } from 'vue';
import { socket } from '../Socket.io/index';
import { User, Socket_Users, Socket_Target, Socket_Message } from '../Pinia';
const input = ref<string>('');
const messageRef = ref<HTMLElement>();
const SocketTarget = computed(() => {
    return Socket_Target().$state;
})
const SocketUsers = Socket_Users();
const SocketMessage = Socket_Message();
const user = User();
const messages = computed(() => {
    return SocketMessage.messages.get(SocketTarget.value.userid)?.data;
})

const sendMessage = async function () {
    socket.emit('private_message', {
        content: input.value,
        to: SocketTarget.value.socketid,
        senderid: user._id,
        receiverid: SocketTarget.value.userid,
        sendername: user.name,
        senderavatar: user.avatar
    });
    if (!SocketMessage.messages.has(SocketTarget.value.userid)) {
        SocketMessage.messages.set(SocketTarget.value.userid, {
            data: [],
            total: 0
        });
    }
    SocketMessage.messages.get(SocketTarget.value.userid)?.data.push({
        type: 'from',
        content: input.value,
        date: new Date()
    });
    // we just assume that .total is not undefined
    SocketMessage.messages.get(SocketTarget.value.userid)!.total += 1;
    input.value = '';
    console.log(messageRef.value)
    console.log('debug: before ', messageRef.value?.scrollHeight)
    console.log('debug: after ', messageRef.value?.scrollHeight)
    await nextTick(() => {
        const scrollHeight = messageRef.value?.scrollHeight as number;
        messageRef.value?.scrollTo({
            top: scrollHeight,
            behavior: 'smooth'
        })
    })
}


onMounted(() => {
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


::-webkit-scrollbar {
    height: 10px !important;
    width: 4px !important;
}

::-webkit-scrollbar-thumb {
    width: 4px !important;
    border-radius: 8px;
    @apply bg-gray-400;
}

.from-user {
    @apply daisy-chat-end;
}

.to-user {
    @apply daisy-chat-start;
}

.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    /* transform: translateX(30px); */
}

.list-leave-active {
    position: absolute;
}
</style>