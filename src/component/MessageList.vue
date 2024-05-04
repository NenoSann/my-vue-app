<template>
    <div class="list-main">
        <ul class="daisy-menu bg-base-200 w-full p-0 [&_li>*]:rounded-none">
            <UserItemSkeleton v-if="loading" v-for="i of 10"></UserItemSkeleton>
            <UserItem 
                v-for="msg of messageList?.values()" v-if="!loading"
                :description="extractTextContent(msg.content.text)"
                :userid="msg.info.id"
                :callback="changeSocketTarget"
                :avatar="msg.info.avatar"
                :name="msg.info.name"
                :index="msg.info.id"
                :online="checkUserInUsermap(msg.info.id)"
                :unread="msg?.total"
                >
            </UserItem>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { UserItem,UserItemSkeleton } from '.';
import { onMounted, ref, Ref } from 'vue';
import { MessageListItem } from '../Interface/NodeLocalStorage';
import { changeSocketTarget, extractTextContent, checkUserInUsermap } from '../util';
import {queryUnreadChatList} from '../API/user';
import { User } from '../Pinia';
const messageList: Ref<Map<string,MessageListItem> | undefined> = ref();
const user = User();
const unreadChats = ref();
const loading = ref(false);

const appendUnreadList = (chats:MessageListItem[])=>{
    for(const chat of chats) {
        messageList.value?.set(chat.info.id,chat);
    }
}

onMounted(async () => {
    const timeout = setTimeout(() => {
        loading.value = true;
    }, 200)
    const messageListMap = new Map<string,MessageListItem>();
    const sqlMessageList = await window.socket.readMessageList() as any;
    sqlMessageList.forEach((listItem:MessageListItem)=>{
        listItem.total = 0;
        messageListMap.set(listItem.info.id,listItem)
    });
    messageList.value = messageListMap;
    loading.value = false;
    clearTimeout(timeout);
    const chats = await queryUnreadChatList(user._id) as MessageListItem[];
    console.log(chats);
    appendUnreadList(chats);
    unreadChats.value = chats;
})

</script>

<style scoped>
.list-main {
    @apply overflow-auto overflow-x-hidden;
}
</style>