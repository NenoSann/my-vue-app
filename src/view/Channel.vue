<template>
    <div class="channel-main">
        <div class="channel-header">{{ SocketTarget.name }}</div>
        <div class="bg-base-200 h-[70%] w-full border-b-[1px] border-b-neutral-700 pb-4 px-2 overflow-auto"
            ref="chatListRef">
            <TransitionGroup name="list">
                <ChatBubble :type="msg.type" :time="formatDate(msg.date)" :avatar="users?.get(msg.sendBy)?.avatar as
                    string" :content="msg.content" :date="msg.date"
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
import { ref, computed, watch, nextTick,reactive } from 'vue';
import { User, Socket_Target, Socket_Message } from '../Pinia';
import { LocalUserIndex, MessageType } from '../Interface/NodeLocalStorage.ts';
import { formatDate, scrollDiv } from '../util';
import type { Window } from '../Interface/preload';
import { queryUnreadChats } from '../API/user/index.ts';

// vue state
const user = User();
const chatListRef = ref();
const SocketTarget = Socket_Target();
const SocketMessage = Socket_Message();
const offset = ref(0);
const messages = computed(() => {
    return SocketMessage.messages.get(SocketTarget.userid)?.data
})
const users = computed(() => SocketMessage.messages.get(SocketTarget.userid)?.user)
const scrollListToEnd = () => {
    // when DOM is updated we call the scrollDiv function
    nextTick().then(() => {
        scrollDiv(chatListRef.value, 'end', 'smooth');
    });
}

const queryLocalMessage = async(target: typeof SocketTarget)=>{
    const userId = user._id;
    const targetUserId = target.userid;
    const res = await window.socket.queryMessages(userId, targetUserId, target.type, 10, 0);
            console.log('DEBUG:check query message:', res);
            // we have to rename the userInfo to userinfo or
            // we will face duplicated names
            const { userInfo, messages: newMessages } = res;
            // const { users } = userinfo;
            // // TODO: we need to change this format in worker.ts
            const messages = newMessages.map((msg) => {
                return {
                    type: msg.type,
                    content: {
                        text: msg.text,
                        image: msg.image
                    },
                    sendBy: msg.sendBy,
                    sent: true,
                    date: new Date(msg.date as number / 1000).toString()
                }
            })
            if (target.type === MessageType.Private) {
                SocketMessage.storeLocally(userId, messages as any, [...userInfo.values()]);
            } else if (target.type === MessageType.Group) {
                SocketMessage.storeLocally(target.userid, messages as any, users);
            }
}

const queryUnreadMessage = async(target: typeof SocketTarget)=>{
    const res = await queryUnreadChats(user._id,target.userid,offset.value,10);
    offset.value = offset.value + 1;
    let {data,info} = res;
    const messages = data.map((msg)=>{
        return  {
            ...msg,
            content:{
                text:msg.text,
                image:msg.image
            }
        }
    })
    SocketMessage.storeLocally(info.id,messages,info);
}

watch(SocketTarget, async (target) => {
    const userId = target.userid;
    if (userId) {
        if (!SocketMessage.messages.has(userId)) {
            const res = await queryUnreadMessage(target);
            console.log(res);
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