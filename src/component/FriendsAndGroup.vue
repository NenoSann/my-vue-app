<template>
    <div class="h-full flex flex-col">
        <div class="px-4">
            <div class="flex h-8 my-2">
                <input
                    type="text"
                    placeholder="搜索"
                    class="placeholder:text-sm placeholder:font-semibold daisy-input w-52 daisy-input-bordered h-full focus:outline-none" />
                <div class="daisy-btn ml-auto no-animation icon">
                    <Icon size="2rem">
                        <Add class="icon" />
                    </Icon>
                </div>
            </div>
            <ul class="list !p-0">
                <li class="list-item">
                    <a class="list-item-a list-item-icon">好友请求</a>
                </li>
            </ul>
        </div>

        <div class="daisy-divider my-1"></div>

        <div class="px-4 mb-2">
            <ul class="list">
                <li class="list-item">
                    <a class="list-item-a" @click="component = UserList"
                        >好友</a
                    >
                </li>
                <li class="list-item">
                    <a class="list-item-a" @click="component = GroupList"
                        >群聊</a
                    >
                </li>
            </ul>
        </div>
        <component :is="component"></component>
    </div>
</template>

<script setup lang="ts">
import { Add } from "@vicons/carbon";
import { Icon } from "@vicons/utils";
import { UserList, GroupList } from "./index";
import { ref, Ref, shallowRef } from "vue";
const component = shallowRef(UserList);
</script>

<style scoped>
:deep(.icon > path) {
    @apply fill-primary;
}

.icon {
    @apply h-8 w-8;
    @apply min-h-[2rem];
}

.list {
    @apply daisy-menu [&_li>*]:rounded-lg;
    @apply p-1 h-8 w-full rounded-lg;
    @apply bg-base-300 font-semibold;
    @apply justify-center;
}

.list-item {
    @apply grow h-full;
}

.list-item-a {
    @apply flex justify-center h-full;
}

.list-item-icon {
    &::after {
        content: ">";
    }
}
</style>
