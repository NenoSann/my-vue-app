/**
 * This function used to handle chat bubble contextmenu event
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event
 * @param event 
 */
import { render, h, VNode } from 'vue';
import ContextMenu from '../../component/ContextMenu.vue';
let contextComponent: VNode | null = null;
let container: Element | null = null;
export function handleContextMenu(event: PointerEvent) {
    container = document.querySelector('#_ContextMenuContainer');
    console.log(event.screenX, event.screenY);
    if (container) {
        unmountContextMenu();
        contextComponent = h(ContextMenu, {
            x: event.clientX,
            y: event.clientY
        });
        render(contextComponent, container)
    }
}

export function copy() {

}

export function unmountContextMenu() {
    if (contextComponent && container) {
        render(null, container)
    }
    contextComponent = null;
}

