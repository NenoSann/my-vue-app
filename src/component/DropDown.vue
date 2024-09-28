<template>
    <div class="dropdown-main" >
        <Icon size="32" @click="toggleShow">
            <slot></slot>
        </Icon>
        <ul class="dropdown-content"  v-show="showDropdown">
            <li v-for="item of items" class="group">
                <a>
                    <Icon size="16" @click="item.onClick()" class="group">
                        <component :is="item.icon"></component>
                    </Icon>
                    {{ item.text }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { ref } from "vue";

const showDropdown = ref(false);
const toggleShow = () => {
    showDropdown.value = !showDropdown.value;
}

const props = defineProps({
    items: Array<{
        icon: any;
        text: string;
        onClick: Function;
    }>,
});
</script>

<style scoped>
.dropdown-main {
    @apply flex items-center justify-center;
    @apply w-full h-[48px];
}

/* change the xicon fill */
:deep(.xicon svg:not([fill]) path) {
    @apply fill-primary;
}

.dropdown-content {
    @apply absolute daisy-menu left-14 bottom-2;
    @apply rounded-md w-48;
}
.dropdown-content > li {
    @apply flex flex-row;
}
.dropdown-content > li > a {
    @apply text-xs;
    /* @apply w-full; */
}
</style>
