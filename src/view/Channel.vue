<template>
    <div class="channel-main">
        <div class="channel-header">{{ SocketTarget.name }}</div>
        <div class="bg-base-200 h-3/4 w-full border-b-[1px] border-b-neutral-700 pb-4 px-2 overflow-auto">
            <TransitionGroup name="list">
                <ChatBubble :type="msg.type" :time="formatDate(msg.date)" :avatar="users![index].avatar"
                    :content="msg.content" :date="msg.date"
                    :name="SocketTarget.type === 'Group' ? users![index].name : undefined"
                    v-for="(msg, index) in messages" :key="index"></ChatBubble>
            </TransitionGroup>
        </div>
        <textarea :disabled="!SocketTarget?.isActive"
            class="relative bg-base-200 daisy-textarea focus:outline-none h-1/4 resize-none w-full rounded-none"
            v-model="input" @keyup.ctrl.enter="sendMessage"></textarea>
        <div class="daisy-btn daisy-btn-outline daisy-btn-primary absolute bottom-4 right-4" @click="sendMessage">
            发送
        </div>
    </div>
</template>

<script setup lang="ts">
import ChatBubble from '../component/ChatBubble.vue';
import { ref, computed } from 'vue';
import { User, Socket_Target, Socket_Message, Socket_Info } from '../Pinia';
import type { Window } from '../Interface/preload';

const input = ref('');
const user = User();
const SocketTarget = Socket_Target();
const SocketInfo = Socket_Info();
const SocketMessage = Socket_Message();

const messages = computed(() => {
    return SocketMessage.messages.get(SocketTarget.userid)?.data
})
const users = computed(() => SocketMessage.messages.get(SocketTarget.userid)?.user)
const userAvatar = computed(() => {
    if (SocketTarget.type === 'User') {
        return SocketMessage.messages.get(SocketTarget.userid)?.user[0].avatar as string
    }
});
const messageHeader = computed(() => ({
    from: SocketInfo.Socket_ID,
    receiverid: SocketTarget.userid,
    senderid: user._id,
    sendername: user.name,
    senderavatar: user.avatar,
    to: SocketTarget.socketid
}));

const sendMessage = async () => {
    const content = { text: input.value };
    const header = { ...messageHeader.value, content };

    if (SocketTarget.type === 'User') {
        window.socket.sendPrivateMessage(header.to, header);
    } else if (SocketTarget.type === 'Group') {
        window.socket.sendGroupMessage(header.to, header);
    }

    SocketMessage.storeLocally(SocketTarget.userid, content);
    input.value = '';
};

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};
</script>

<style scoped>
.channel-main {
    /* test background */
    @apply bg-slate-200 relative;
    @apply grow h-full;
    @apply overflow-hidden;
}

.channel-header {
    @apply flex items-center;
    @apply px-2 h-12;
    @apply bg-base-200;
    @apply border-b-[1px] border-neutral-700;
    @apply text-lg;
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
.list-enter-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    /* transform: translateX(30px); */
}
</style>