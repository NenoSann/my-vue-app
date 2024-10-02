/** * This is a simple component for ContextMenu to render and unmounted */
<template>
    <div
        class="w-screen h-screen min-w-[100vw] min-h-screen bg-transparent absolute pointer-events-none"
        id="_ContextMenuContainer"
        @click="unmountContextMenu">
    </div>
</template>
<script lang="ts" setup>
import { unmountContextMenu } from "../util/context_menu";

</script>
