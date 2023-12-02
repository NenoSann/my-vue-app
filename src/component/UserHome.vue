<template>
    <div class="flex grow">
        <UserMenu></UserMenu>
        <!-- <Channel></Channel> -->
        <FriendsView></FriendsView>
    </div>
</template>

<script setup lang="ts">
import UserMenu from '../component/HomeMenu.vue'
import Channel from '../view/Channel.vue'
import FriendsView from '../view/FriendsView.vue';
</script>
