<template>
    <div class="dropdown-main" ref="dropdownRef">
        <div class="dropdown-icon sidebar-icon-hover" @click="toggleShow">
            <Icon size="32">
                <slot></slot>
            </Icon>
        </div>
        <ul class="dropdown-content" v-if="showDropdown">
            <li v-for="(item, index) of items" :tabindex="index">
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
import { ref, onMounted } from "vue";

const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const toggleShow = () => {
    showDropdown.value = !showDropdown.value;
    if (showDropdown.value) {
        document.addEventListener("click", handleOutsideClick);
    } else {
        document.removeEventListener("click", handleOutsideClick);
    }
};

const props = defineProps({
    items: Array<{
        icon: any;
        text: string;
        onClick: Function;
    }>,
});

onMounted(() => {
    document.addEventListener("click", handleOutsideClick);
});

//如果点击了dropdown外的区域, 则将dropdown-show关闭
const handleOutsideClick = (event: MouseEvent) => {
    if (
        dropdownRef.value &&
        !dropdownRef.value.contains(event.target as Node)
    ) {
        showDropdown.value = false;
    }
};
</script>

<style scoped>
.dropdown-main {
    @apply flex items-center justify-center;
    @apply w-full h-[48px];
}

.dropdown-icon {
    @apply flex items-center justify-center;
    @apply w-full h-[48px] rounded-md;
}

/* change the xicon fill */
:deep(.xicon svg:not([fill]) path) {
    @apply fill-primary;
}

.dropdown-content {
    @apply absolute daisy-menu left-16 bottom-2;
    @apply rounded-md w-48 p-1 z-10;
    @apply bg-white bg-opacity-5 backdrop-blur-md;
}
.dropdown-content > li {
    @apply flex flex-row w-full;
}
.dropdown-content > li > a {
    @apply text-xs w-full;
    /* @apply w-full; */
}
</style>
