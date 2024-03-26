<template>
    <div>
        <ul class="daisy-menu bg-base-200 w-full h-full p-0 [&_li>*]:rounded-none">
            <UserItem v-for="(user, index) in userlist" :userid="user[0]" :name="user[1].username"
                :avatar="user[1].avatar" :index="index" :callback="handleLiSelect" :unread="getUnread(user[0])">
            </UserItem>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { User, Socket_Users, Socket_Target, Socket_Message } from '../Pinia';
import { useRouter } from 'vue-router';
import UserItem from './UserItem.vue';
const router = useRouter();
const SocketUsers = Socket_Users();
const user = User();
const _id = user._id;
const SocketTarget = Socket_Target();
const SocketMessage = Socket_Message();
const userlist = computed(() => {
    return SocketUsers.usermap;
})

function getUnread(targetUserId: string) {
    const unread = SocketMessage.messages.get(targetUserId)?.unread;
    if (!unread) {
        return '';
    }
    return unread.toString();
}

function handleLiSelect(avatar: string, username: string, userid: string) {
    SocketTarget.isActive = true;
    SocketTarget.type = 'user';
    SocketTarget.avatar = avatar;
    SocketTarget.name = username
    SocketTarget.socketid = SocketUsers.usermap.get(userid)?.socketid as string;
    SocketTarget.userid = userid
    const fullpath = '/channels/@me'
    router.replace(fullpath + '/' + user[0]);
}
</script>

<style scoped>
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