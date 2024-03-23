<template>
    <div class="flex flex-col w-full h-full bg-neutral">
        <div class="flex h-10 items-center py-6 border-b-2 border-b-base-content shadow-md select-none">
            <div class="flex gap-2 items-center px-2">
                <svg class=" fill-base-content stroke-neutral" width="32px" height="32px" viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path
                            d="M25 17a1 1 0 11-2 0 1 1 0 012 0zm-4-1h-2a1 1 0 000 2h2a1 1 0 000-2zm8.924 10.383A1 1 0 0129 27H3a1 1 0 01-.707-1.707L5 22.586V7a1 1 0 011-1h20a1 1 0 011 1v8c0 .009-.005.016-.005.025C27.618 15.859 28 16.882 28 18s-.382 2.141-1.005 2.975c0 .009.005.016.005.025v1.586l2.707 2.707a1 1 0 01.217 1.09zM9 19H8c-.551 0-1 .449-1 1v5h2v-6zm0-2c0-3.86 3.14-7 7-7h4c1.9 0 3.697.784 5 2.11V8H7v9.184A2.964 2.964 0 018 17h1zm16 5.576A4.961 4.961 0 0123 23h-4c-2.757 0-5-2.243-5-5s2.243-5 5-5h3.991A5.009 5.009 0 0020 12h-4c-2.757 0-5 2.243-5 5v8h14v-2.424zM26 18c0-1.654-1.346-3-3-3h-4c-1.654 0-3 1.346-3 3s1.346 3 3 3h4c1.654 0 3-1.346 3-3z">
                        </path>
                    </g>
                </svg>
                <p class=" font-semibold">好友</p>
            </div>
            <div class="divider h-6 w-[1px] bg-base-content"></div>
            <ul class="daisy-menu daisy-menu-sm daisy-menu-horizontal  gap-4">
                <li @click="handleComponentChange('online')">
                    <a tabindex="0" class="text-base">
                        在线
                    </a>
                </li>
                <li @click="handleComponentChange('all')">
                    <a tabindex="0" class="text-base">
                        全部
                    </a>
                </li>
                <li @click="handleComponentChange('pending')">
                    <a tabindex="0" class="text-base">
                        待定
                    </a>
                </li>
                <li @click="handleComponentChange('blocked')">
                    <a tabindex="0" class="text-base">
                        已屏蔽
                    </a>
                </li>
            </ul>
        </div>
        <div class="flex h-full w-full justify-center items-center no-online-bg">

        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import { IFriend } from '../Interface/Response';
import { User } from '../Pinia';
import { queryFriends } from '../API/user/index'
const user = User();
const friendsList: Ref<Array<IFriend>> = ref([]);
const userlist = ref<{
    id: string,
    type: number,
    nickname: string,
    user: {
        id: string,
        username: string,
        global_name: string | null,
        avatar: string,
        public_flags?: number
    },
    since: Date
}[]>([]);
const componentState = ref<'online' | 'all' | 'pending' | 'blocked'>('online')
const handleComponentChange = function (state: 'online' | 'all' | 'pending' | 'blocked') {
    componentState.value = state;
}

onMounted(async () => {
    try {
        friendsList.value = (await queryFriends(user._id, 20, 0)).items;
    } catch {

    }
})
</script>

<style scoped>
.no-online-bg {
    background-image: url('../../assets/No_online.svg');
    background-repeat: no-repeat;
    background-size: 60% 40%;
    background-position: center;
}
</style>