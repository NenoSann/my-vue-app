<template>
    <div class="list-main">
        <ul class="daisy-menu bg-base-200 w-full p-0 [&_li>*]:rounded-none">
            <UserItemSkeleton v-if="loading" v-for="i of 10"></UserItemSkeleton>
            <UserItem :description="extractTextContent(getLatestMessage(msg.content).content.text)"
                :userid="msg.info.userId" :callback="changeSocketTarget" :avatar="msg.info.avatar" :name="msg.info.name"
                :index="msg.info.userId" :online="checkUserInUsermap(msg.info.userId)" v-for="msg of messageList"
                v-if="!loading">
            </UserItem>
        </ul>
    </div>
</template>

<script setup lang="ts">
import UserItemSkeleton from './UserItemSkeleton.vue'
import { UserItem } from '.';
import { onMounted, ref, Ref, computed } from 'vue';
import { LocalMessageList } from '../Interface/NodeLocalStorage';
import { changeSocketTarget, extractTextContent, checkUserInUsermap } from '../util';
const messageList: Ref<Array<LocalMessageList> | undefined> = ref();
const loading = ref(false);
onMounted(async () => {
    const timeout = setTimeout(() => {
        loading.value = true;
    }, 200)
    messageList.value = (await window.socket.readMessageList() as any).content;
    loading.value = false;
    clearTimeout(timeout);
})

const getLatestMessage = (arr: Array<any>) => {
    return arr[arr.length - 1];
}
</script>

<style scoped>
.list-main {
    @apply overflow-auto overflow-x-hidden;
}
</style>