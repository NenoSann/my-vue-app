<template>
    <div id="app">
        <RouterView> </RouterView>
        <ContextMenuContainer> </ContextMenuContainer>
    </div>
</template>

<script setup lang="ts">
import ContextMenuContainer from "./component/ContextMenuContainer.vue";
import { onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { User } from "./Pinia";
import { Window } from "./Interface/preload";
const userLoginInfo = computed(() => {
    const user = User();
    if (user?._id) {
        return {
            name: user.name,
            _id: user._id,
            avatar: user.avatar,
        };
    }
});

watch(
    userLoginInfo,
    (newInfo) => {
        if (newInfo?.name && newInfo.avatar && newInfo._id) {
            const user = User();
            window.socket.close();
            window.socket.createSocket(
                newInfo.name,
                newInfo._id,
                newInfo.avatar,
            );
            window.socket.joinGroup(
                user.groups.map((group) => {
                    return group._id;
                }),
                user._id,
                user.name,
                user.avatar,
            );
        }
    },
    { immediate: true },
);

const router = useRouter();
onMounted(() => {
    if (localStorage.getItem("user") === null) {
        router.push("/login");
    } else {
        router.push("/channels/@me");
    }
});
</script>
<style scoped>
#app {
    @apply flex flex-row;
    @apply h-screen w-screen;
}
</style>
