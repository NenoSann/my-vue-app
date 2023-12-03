<template>
    <div>
        <ul class=" daisy-menu bg-base-200 w-full">
            <li v-for="user in userlist" :key="user[0]" @click="handleLiSelect(user)"
                @keypress.enter="handleLiSelect(user)">
                <a tabindex="0">
                    <div class="daisy-avatar w-6">
                        <img class="rounded-full"
                            :src="user[1]?.avatar === 'default' ? '../../assets/icon.png' : user[1]?.avatar" :alt="user[0]">
                    </div>
                    {{ user[1]?.username }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Socket_Users, Socket_Target } from '../Pinia';
import { useRouter, useRoute } from 'vue-router'
const router = useRouter();
const route = useRoute();
const SocketUsers = Socket_Users();
const SocketTarget = Socket_Target();
const userlist = computed(() => {
    return SocketUsers.usermap;
})
const handleLiSelect = (user: [string, { avatar: string, socketid: string, username: string }]) => {
    SocketTarget.isActive = true;
    SocketTarget.type = 'user';
    SocketTarget.avatar = user[1].avatar;
    SocketTarget.name = user[1].username;
    SocketTarget.socketid = user[1].socketid;
    const fullpath = '/channels/@me'
    router.replace(fullpath + '/' + user[0]);
}
</script>

<style scoped></style>