<template>
    <div class="channel-main">
        <div class="channel-header">{{ SocketTarget.name }}</div>
        <div class="bg-base-200 h-3/4 w-full border-b-[1px] border-b-neutral-700 pb-4 px-2 overflow-auto">
            <TransitionGroup name="list">
                <ChatBubble :type="msg.type" :time="formatDate(msg.date)"
                    :avatar="users?.get(msg.sendBy)?.avatar as string" :content="msg.content" :date="msg.date"
                    :name="SocketTarget.type === 'Group' ? users?.get(msg.sendBy)?.name : undefined"
                    v-for="(msg, index) in messages" :key="index"></ChatBubble>
            </TransitionGroup>
        </div>
        <textarea spellcheck="false" :disabled="!SocketTarget?.isActive"
            class="relative bg-base-200 daisy-textarea focus:outline-none h-1/4 resize-none w-full rounded-none"
            v-model="input" @keyup.ctrl.enter="sendMessage"></textarea>
        <div class="daisy-btn daisy-btn-outline daisy-btn-primary absolute bottom-4 right-4" @click="sendMessage">
            发送
        </div>
    </div>
</template>

<script setup lang="ts">
import ChatBubble from '../component/ChatBubble.vue';
import { ref, computed, watch } from 'vue';
import { User, Socket_Target, Socket_Message, Socket_Info } from '../Pinia';
import { LocalUserIndex, MessageType } from '../Interface/NodeLocalStorage.ts';
import { formatDate } from '../util';
import type { Window } from '../Interface/preload';

// vue state
const input = ref('');
const user = User();
const SocketTarget = Socket_Target();
const SocketInfo = Socket_Info();
const SocketMessage = Socket_Message();

const messages = computed(() => {
    return SocketMessage.messages.get(SocketTarget.userid)?.data
})
const users = computed(() => SocketMessage.messages.get(SocketTarget.userid)?.user)

const messageHeader = computed(() => ({
    from: SocketInfo.Socket_ID,
    receiverid: SocketTarget.userid,
    receiveravatar: SocketTarget.avatar,
    receivername: SocketTarget.name,
    senderid: user._id,
    sendername: user.name,
    senderavatar: user.avatar,
    to: SocketTarget.socketid
}));

const userInfo = computed(() => {
    return {
        avatar: user.avatar,
        name: user.name,
        userId: user._id
    }
})

/**
 * handle the socket message sending, both private and group
 * if event is successfully ack, the callback function will add 
 * the info local pinia
 */
const sendMessage = async () => {
    const content = { text: input.value };
    const header = { ...messageHeader.value, content };

    if (SocketTarget.type === MessageType.Private) {
        window.socket.sendPrivateMessage(header.to, header).then(() => {
            SocketMessage.storeLocally(SocketTarget.userid, {
                type: 'to',
                content,
                date: new Date(),
                sendBy: user._id
            }, userInfo.value);
        });
    } else if (SocketTarget.type === MessageType.Group) {
        window.socket.sendGroupMessage(header.to, header).then(() => {
            SocketMessage.storeLocalGroup(SocketTarget.userid, {
                type: 'to',
                content,
                date: new Date(),
                sendBy: user._id,
            }, userInfo.value)
        });
    }
    input.value = '';
};

watch(SocketTarget, async (target) => {
    const userId = target.userid;
    if (userId) {
        if (!SocketMessage.messages.has(userId)) {
            const res = await window.socket.queryMessages(userId, target.type, 2, 0);
            // we have to rename the userInfo to userinfo or
            // we will face dublicated names
            const { userInfo: userinfo } = res;
            const { users } = userinfo;
            // TODO: we need to change this format in worker.ts
            const messages = res.messages.map((msg) => {
                return {
                    ...msg.content,
                    date: msg.date,
                }
            })
            if (target.type === MessageType.Private) {
                SocketMessage.storeLocally(users[0].userId, messages as any, [...users, userInfo.value]);
            } else if (target.type === MessageType.Group) {
                SocketMessage.storeLocally(target.userid, messages as any, users);
            }
        }
    }
}, { immediate: true });

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