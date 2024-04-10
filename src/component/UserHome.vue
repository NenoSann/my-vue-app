<template>
    <div class="flex grow">
        <UserMenu></UserMenu>
        <!-- <Channel></Channel> -->
        <!-- <FriendsView></FriendsView> -->
        <div class="grow h-full">
            <Channel></Channel>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import UserMenu from './SideBar2.vue'
import Channel from '../view/Channel.vue'
</script>
