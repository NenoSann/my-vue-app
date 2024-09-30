<template>
    <div class="side-bar flex flex-col shrink-0 gap-1 p-2">
        <div class="me border-b-[1px]">
            <TheIcon
                @click="router.push('/login')"
                :img_url="imageURL"></TheIcon>
        </div>
        <div
            class="sidebar-icon sidebar-icon-hover"
            @click="
                () => {
                    sidebar.sidebar = eSideBar.Friends;
                }
            ">
            <Icon size="36" class="fill-primary">
                <Chat />
            </Icon>
        </div>
        <div
            class="sidebar-icon sidebar-icon-hover"
            @click="
                () => {
                    sidebar.sidebar = eSideBar.Groups;
                }
            ">
            <Icon size="32">
                <Friendship />
            </Icon>
        </div>
        <div
            class="sidebar-icon sidebar-icon-hover"
            @click="testI18n">
            <Icon size="32">
                <NodeJs />
            </Icon>
        </div>
        <div class="sidebar-icon sidebar-icon-hover">
            <Icon size="32">
                <Award />
            </Icon>
        </div>
        <div class="sidebar-icon sidebar-icon-hover">
            <Icon size="32">
                <Folder />
            </Icon>
        </div>

        <div class="sidebar-icons-bottom">
            <div class="sidebar-icon-bottom">
                <DropDown :items="dropdownItems">
                    <Settings></Settings>
                </DropDown>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SideBar, TheIcon, DropDown } from "./index";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { NodeJs, Award } from "@vicons/fa";
import { Settings, Chat, Friendship, Folder, DataBackup } from "@vicons/carbon";
import { Icon } from "@vicons/utils";
import { User, ComponentState, eSideBar } from "../Pinia";
import { ref, watch, computed } from "vue";
import { MessageType } from "../Interface/NodeLocalStorage.ts";

const i18n = useI18n();
const user = User();
const sidebar = ComponentState();
const router = useRouter();
const imageURL = computed(() => {
    return user?.avatar;
});

const testI18n = async () => {
    i18n.locale.value = Math.random() > 0.5 ? 'en' : 'cn';
};

const dropdownItems = [
    {
        icon: DataBackup,
        text: "备份聊天记录",
        onClick: () => {
            console.log("test backup messages!");
        },
    },
];
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
}

.sidebar-icons-bottom {
    @apply flex flex-col;
    @apply w-full h-[48px] mt-auto;
}

/* change the xicon fill */
:deep(.sidebar-icon > span > svg > path) {
    @apply fill-primary;
}

.sidebar-icon > svg {
    isolation: isolate;
}
</style>
