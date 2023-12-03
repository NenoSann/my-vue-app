<template>
    <div class="flex flex-col w-60 h-full  px-2 select-none">
        <ul class="daisy-menu w-full bg-base-200 gap-[2px]">
            <li><a tabindex="1">
                    <svg width="32px" height="32px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"
                        transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M25 17a1 1 0 11-2 0 1 1 0 012 0zm-4-1h-2a1 1 0 000 2h2a1 1 0 000-2zm8.924 10.383A1 1 0 0129 27H3a1 1 0 01-.707-1.707L5 22.586V7a1 1 0 011-1h20a1 1 0 011 1v8c0 .009-.005.016-.005.025C27.618 15.859 28 16.882 28 18s-.382 2.141-1.005 2.975c0 .009.005.016.005.025v1.586l2.707 2.707a1 1 0 01.217 1.09zM9 19H8c-.551 0-1 .449-1 1v5h2v-6zm0-2c0-3.86 3.14-7 7-7h4c1.9 0 3.697.784 5 2.11V8H7v9.184A2.964 2.964 0 018 17h1zm16 5.576A4.961 4.961 0 0123 23h-4c-2.757 0-5-2.243-5-5s2.243-5 5-5h3.991A5.009 5.009 0 0020 12h-4c-2.757 0-5 2.243-5 5v8h14v-2.424zM26 18c0-1.654-1.346-3-3-3h-4c-1.654 0-3 1.346-3 3s1.346 3 3 3h4c1.654 0 3-1.346 3-3z">
                            </path>
                        </g>
                    </svg>
                    好友</a></li>
            <li><a tabindex="2">
                    <svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M24.462 8.981h-17.969l0.018-1.934h1.436l3.039-2.995h9.109l2.977 2.995h1.436l-0.046 1.934zM17.037 6.049h-2.995v0.998h2.995v-0.998zM22.857 17.030h-3.377c-0.745-1.451-2.239-2.454-3.982-2.454s-3.237 1.003-3.981 2.454h-3.318l-0.646-6.988h15.973l-0.669 6.988zM13.044 19.026c0-1.378 1.117-2.496 2.496-2.496 1.378 0 2.495 1.118 2.495 2.496s-1.117 2.496-2.495 2.496c-1.379 0-2.496-1.118-2.496-2.496zM15.498 23.561c1.794 0 3.33-1.059 4.050-2.579h2.931l-0.762 7.966h-12.416l-0.736-7.966h2.884c0.72 1.52 2.255 2.579 4.049 2.579z">
                            </path>
                        </g>
                    </svg>Steriod</a></li>
            <li><a tabindex="3">
                    <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M5 3C3.89543 3 3 3.89543 3 5V6.83772L1.49006 11.3675C1.10052 12.5362 1.8474 13.7393 3 13.963V20C3 21.1046 3.89543 22 5 22H9H10H14H15H19C20.1046 22 21 21.1046 21 20V13.963C22.1526 13.7393 22.8995 12.5362 22.5099 11.3675L21 6.83772V5C21 3.89543 20.1046 3 19 3H5ZM15 20H19V14H17.5H12H6.5H5V20H9V17C9 15.3431 10.3431 14 12 14C13.6569 14 15 15.3431 15 17V20ZM11 20H13V17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17V20ZM3.38743 12L4.72076 8H6.31954L5.65287 12H4H3.38743ZM7.68046 12L8.34713 8H11V12H7.68046ZM13 12V8H15.6529L16.3195 12H13ZM18.3471 12L17.6805 8H19.2792L20.6126 12H20H18.3471ZM19 5V6H16.5H12H7.5H5V5H19Z">
                            </path>

                        </g>
                    </svg>商店</a></li>
        </ul>
        <div class="h-full flex flex-col bg-base-200">
            <div class="flex items-center px-5">
                <p class="text-sm font-semibold">私信</p>
                <div class="daisy-tooltip ml-auto" data-tip="创建私信">
                    <svg class=" stroke-base-content" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M6 12H18M12 6V18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            </path>
                        </g>
                    </svg>
                </div>
            </div>
            <UserList></UserList>
        </div>
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