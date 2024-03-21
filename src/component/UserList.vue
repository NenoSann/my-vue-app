<template>
    <div>
        <ul class=" daisy-menu bg-base-200 w-full">
            <li class="list-item" :class="{ 'has-unread': getUnreadMessage(user[0]) !== null }"
                :data-unread="getUnreadMessage(user[0])" v-for="(user, index) in userlist" :key="user[0]"
                @click="handleLiSelect(user)" @keypress.enter="handleLiSelect(user)">
                <a :tabindex="index">
                    <div class="daisy-avatar daisy-online w-6">
                        <img class="rounded-full"
                            :src="user[1]?.avatar === 'default' ? '../../assets/icon.png' : user[1]?.avatar"
                            :alt="user[0]">
                    </div>
                    {{ user[1].username }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { User, Socket_Users, Socket_Target, Socket_Message } from '../Pinia';
import { useRouter } from 'vue-router'
const router = useRouter();
const SocketUsers = Socket_Users();
const user = User();
const SocketTarget = Socket_Target();
const SocketMessage = Socket_Message();
const userlist = computed(() => {
    return SocketUsers.usermap;
})
const getUnreadMessage = function (userid: string): string | null {
    // if the id is user itself
    if (user._id === userid || !SocketMessage.messages.has(userid)) {
        return null;
    } else if (SocketMessage.messages.get(userid)!.total >= 99) {
        return '99+';
    } else {
        return SocketMessage.messages.get(userid)?.total.toString() as string;
    }
}
const handleLiSelect = (user: [string, { avatar: string, socketid: string, username: string }]) => {
    SocketTarget.isActive = true;
    SocketTarget.type = 'user';
    SocketTarget.avatar = user[1].avatar;
    SocketTarget.name = user[1].username;
    SocketTarget.socketid = user[1].socketid;
    SocketTarget.userid = user[0];
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
</style>