<template>
    <div class="channel-main">
        <div class="h-3/4 w-full">
            <TransitionGroup name="list">
                <div class="daisy-chat" :class="{ 'to-user': message.type === 'to', 'from-user': message.type === 'from' }"
                    v-for="message in messages" :key="message.content">
                    <div class="daisy-chat-image daisy-avatar">
                        <div class="w-10 rounded-full">
                            <img alt="You" src="../../assets/icon.png" />
                        </div>
                    </div>
                    <div class="daisy-chat-header">
                        {{ message.sendername }}
                    </div>
                    <div class="daisy-chat-bubble">{{ message.content }}</div>
                </div>
            </TransitionGroup>
        </div>
        <textarea :disabled="!SocketTarget?.isActive" class="relative daisy-textarea h-1/4 resize-none w-full rounded-none"
            v-model="input"></textarea>
        <div class="daisy-btn daisy-btn-outline daisy-btn-primary absolute bottom-4 right-4 " @click="sendMessage">SEND
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { io } from 'socket.io-client';
import { User, Socket_Users, Socket_Target } from '../Pinia';
const input = ref<string>('');
const SocketTarget = computed(() => {
    return Socket_Target().$state;
})
const SocketUsers = Socket_Users();
const messages = ref<{
    content: string,
    type: 'from' | 'to',
    sendername: string,
    time?: string
}[]>([]);
const socket = io('http://localhost:8080', {
    auth: {
        username: User()._id
    },
    extraHeaders: {
        'x-username': User().name,
        'x-avatar': User().avatar,
        'x-id': User()._id
    }
});

const sendMessage = function () {
    socket.emit('private_message', {
        content: input.value,
        to: SocketTarget.value.socketid,
        senderid: User()._id,
        sendername: User().name,
        senderavatar: User().avatar
    });
    messages.value.push({
        content: input.value,
        type: 'from',
        sendername: 'You'
    })
    input.value = '';
}


onMounted(() => {
    socket.on('connect', () => {
        console.log(`socket is ${socket.connected}`);
    });
    socket.on('message', (args: any) => {
        messages.value.push(args);
    })
    socket.on('users', (data: string) => {
        // when server send usermap we replace it;
        SocketUsers.usermap = new Map(JSON.parse(data));
        if (SocketUsers.usermap.get(User()._id) !== undefined) {
            // what type ?
            (SocketUsers.usermap.get(User()._id) as {
                avatar: string;
                username: string;
                socketid: string;
            }).username = 'You';
        }
        console.log('users data: ', new Map(JSON.parse(data)));
    })
    socket.on('disconnect', () => {

    })
    socket.on('user_connected', (data: any) => {
        console.log('user_connected', data);
        SocketUsers.usermap.set(data.userid, data.userInfo);
        console.log('now the usermap is :', SocketUsers.usermap)
    })
    socket.on('user_disconnect', (userid: string) => {
        console.log('user_disconnect', userid);
        SocketUsers.usermap.delete(userid);
        console.log('now the usermap is :', SocketUsers.usermap);
    })

    socket.on('private_message', (data: {
        content: string,
        from: string,
        senderid: string,
        sendername: string,
        senderavatar: string
    }) => {
        console.log('get private message');
        messages.value.push({
            content: data.content,
            type: 'to',
            sendername: data.sendername
        });
        console.log('from user:  ', SocketUsers.usermap.get(data.from));
    })
})

onBeforeUnmount(() => {
    // before component unmounted, close the socket connection mannuly
})
</script>

<style scoped>
.channel-main {
    /* test background */
    @apply bg-slate-200 p-2 relative;
    @apply grow;
    @apply overflow-hidden;
}

.from-user {
    @apply daisy-chat-end;
}

.to-user {
    @apply daisy-chat-start;
}

.list-move,
/* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.list-leave-active {
    position: absolute;
}
</style>