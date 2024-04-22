<template>
    <div class="channel-main">
        <div class="channel-header">{{ SocketTarget.name }}</div>
        <div class="bg-base-200 h-[70%] w-full border-b-[1px] border-b-neutral-700 pb-4 px-2 overflow-auto"
            ref="chatListRef">
            <TransitionGroup name="list">
                <ChatBubble :type="msg.type" :time="formatDate(msg.date)"
                    :avatar="users?.get(msg.sendBy)?.avatar as string" :content="msg.content" :date="msg.date"
                    :name="SocketTarget.type === 'Group' ? users?.get(msg.sendBy)?.name : undefined"
                    v-for="(msg, index) in messages" :key="msg.date"></ChatBubble>
            </TransitionGroup>
        </div>
        <MessageInput :disabled="!SocketTarget.isActive" @update:scroll="scrollListToEnd">
        </MessageInput>
    </div>
</template>

<script setup lang="ts">
import { ChatBubble, MessageInput } from '../component';
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { User, Socket_Target, Socket_Message } from '../Pinia';
import { LocalUserIndex, MessageType } from '../Interface/NodeLocalStorage.ts';
import { formatDate, scrollDiv } from '../util';
import type { Window } from '../Interface/preload';

// vue state
const user = User();
const chatListRef = ref();
const SocketTarget = Socket_Target();
const SocketMessage = Socket_Message();

const messages = computed(() => {
    return SocketMessage.messages.get(SocketTarget.userid)?.data
})
const users = computed(() => SocketMessage.messages.get(SocketTarget.userid)?.user)
const userInfo = computed(() => {
    return {
        avatar: user.avatar,
        name: user.name,
        userId: user._id
    }
})
const scrollListToEnd = () => {
    // when DOM is updated we call the scrollDiv function
    nextTick().then(() => {
        scrollDiv(chatListRef.value, 'end', 'smooth');
    });
}

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
        nextTick().then(() => {
            scrollDiv(chatListRef.value, 'end', 'instant');
        })
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