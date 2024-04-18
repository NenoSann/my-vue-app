<template>
    <div class="flex flex-col w-80 h-full border-r-[1px] border-neutral-600  select-none">
        <component :is="component"></component>
        <!-- <MessageList></MessageList> -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { ComponentState, eContent, eSideBar } from '../Pinia';
import { UserList, FriendsAndGroup, MessageList } from '.';
const state = ComponentState();
const component = computed(() => {
    switch (state.sidebar) {
        case eSideBar.Friends:
            return MessageList;
        case eSideBar.Groups:
            return FriendsAndGroup;
        default:
            break;
    }
})

</script>

<style scoped>
.daisy-menu li svg {
    @apply fill-base-content;
    @apply stroke-neutral;
}

.daisy-menu li a {
    @apply font-semibold;
    @apply p-2;
}
</style>