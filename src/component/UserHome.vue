<template>
    <div class="flex grow">
        <UserMenu></UserMenu>
        <!-- <Channel></Channel> -->
        <!-- <FriendsView></FriendsView> -->
        <component :is="component_name"></component>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import UserMenu from '../component/HomeMenu.vue'
import Channel from '../view/Channel.vue'
import FriendsView from '../view/FriendsView.vue';

const component_name = computed(() => {
    if (useRoute().params.userid === undefined) {
        return FriendsView;
    } else {
        return Channel;
    }
})
</script>
