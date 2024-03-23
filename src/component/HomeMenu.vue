<template>
    <div class="flex flex-col w-80 h-full border-r-[1px] border-neutral-600  select-none">
        <UserList></UserList>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import UserList from './UserList.vue';
const router = useRouter();
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