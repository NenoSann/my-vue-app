/**
 * This function used to handle chat bubble contextmenu event
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event
 * @param event 
 */
import { render, h, VNode } from 'vue';
import ContextMenu from '../../component/ContextMenu.vue';
let contextComponent: VNode | null = null;
let container: Element | null = null;
export function handleContextMenu(event: PointerEvent | MouseEvent) {
    container = document.querySelector('#_ContextMenuContainer');
    const target = event.target as HTMLElement;
    if (container) {
        unmountContextMenu();
        // check if context is overflowing window
        // see: https://stackoverflow.com/questions/66752899/stop-context-menu-from-getting-cut-in-the-right-of-the-page
        const contextMenuWidth = 128;
        const subLeft = event.pageX < window.innerWidth - contextMenuWidth ? false : true;
        contextComponent = h(ContextMenu, {
            x: event.clientX,
            y: event.clientY,
            targetType: target.tagName,
            copy: copy(event),
            paste: paste(event),
            subLeft,
        });
        render(contextComponent, container)
    }
}

export function copy(event: PointerEvent | MouseEvent) {
    const target = event.target as HTMLElement;
    return () => {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        navigator.clipboard.writeText(selection?.toString());
    }
}

export function paste(event: PointerEvent | MouseEvent) {
    // see https://stackoverflow.com/questions/2920150/insert-text-at-cursor-in-a-content-editable-div
    function insertTextAtCursor(text: string) {
        const selection = window.getSelection();
        let range = selection?.getRangeAt(0)
        range?.deleteContents();
        let node = document.createTextNode(text);
        range?.insertNode(node);
    }
    const target = event.target as HTMLElement;
    return () => {
        navigator.clipboard.readText().then((value) => {
            insertTextAtCursor(value);
            return;
        })
    }
}

export function unmountContextMenu() {
    if (contextComponent && container) {
        render(null, container)
    }
    contextComponent = null;
}

