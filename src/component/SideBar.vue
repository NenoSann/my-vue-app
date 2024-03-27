<template>
    <div class="side-bar flex flex-col gap-1 p-2">
        <div class="me border-b-[1px]">
            <TheIcon @click="router.push('/login')" :img_url="User().avatar"></TheIcon>
        </div>
        <div class="sidebar-icon friends">
            <Icon size="36" class=" fill-primary">
                <Comments />
            </Icon>
        </div>
        <div class="sidebar-icon">
            <Icon size="32" color="#66ccff">
                <AddressBook />
            </Icon>
        </div>
    </div>
</template>

<script setup lang="ts">
import TheIcon from './TheIcon.vue';
import { useRouter } from 'vue-router';
import { Comments, AddressBook } from '@vicons/fa';
import { Icon } from '@vicons/utils';
import { User } from '../Pinia';
const router = useRouter();
</script>

<style scoped>
.side-bar {
    @apply grow-0;
    @apply w-16 h-full;
    @apply bg-neutral;
    @apply bg-neutral;
}



.sidebar-icon {
    @apply flex justify-center items-center;
    @apply w-full h-[48px] rounded-xl p-1;
    @apply hover:bg-neutral-300 hover:bg-opacity-10 transition-all hover:isolate;
}

/* change the xicon fill */
:deep(.sidebar-icon > span > svg > path) {
    @apply fill-primary;
}

.sidebar-icon>svg {
    isolation: isolate;
}
</style>