<template>
    <div>
        <ul class="daisy-menu bg-base-200 w-full h-full p-0 [&_li>*]:rounded-none">
            <UserItem v-for="(group, index) in groupList" :userid="group._id" :name="group.groupName"
                :avatar="group.groupAvatar" :index="index" :online="true" :unread="'0'" :callback="handleLiSelect">
            </UserItem>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { UserItem } from '.';
import { User, Socket_Target } from '../Pinia';
import { computed } from 'vue';
const SocketTarget = Socket_Target();
const groupList = computed(() => {
    const user = User();
    return user.groups;
})
function handleLiSelect(avatar: string, username: string, userid: string) {
    SocketTarget.isActive = true;
    SocketTarget.type = 'Group';
    SocketTarget.avatar = avatar;
    SocketTarget.name = username
    SocketTarget.socketid = userid;
    SocketTarget.userid = userid
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