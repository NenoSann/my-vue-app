/**
 * This function used to handle chat bubble contextmenu event
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event
 * @param event
 */
import { render, h, VNode } from "vue";
import { ContextMenu, EmojiPanel } from "../../component";
import DOMPurify from "dompurify";
let contextComponent: VNode | null = null;
let container: Element | null = null;
export function handleContextMenu(event: PointerEvent | MouseEvent) {
    container = document.querySelector("#_ContextMenuContainer");
    const target = event.target as HTMLElement;
    if (container) {
        unmountContextMenu();
        // check if context is overflowing window
        // see: https://stackoverflow.com/questions/66752899/stop-context-menu-from-getting-cut-in-the-right-of-the-page
        const contextMenuWidth = 128;
        const subLeft =
            event.pageX < window.innerWidth - contextMenuWidth ? false : true;
        contextComponent = h(ContextMenu, {
            x: event.clientX,
            y: event.clientY,
            targetType: target.tagName,
            copy: copy(),
            paste: paste(),
            addEmoji: target.tagName === "IMG" ? addEmoji(event) : undefined,
            subLeft,
        });
        render(contextComponent, container);
    }
}

// let emojiPanelComponent: VNode | null = null;
// export function openEmojisPanel(event: PointerEvent | MouseEvent) {
//     const target = event.target as HTMLElement;
//     const container = document.querySelector('#_ContextMenuContainer');
//     if (!emojiPanelComponent) {
//         emojiPanelComponent = h(EmojiPanel);

//     }

// }

export function _copy(event: PointerEvent | MouseEvent) {
    const target = event.target as HTMLElement;
    return () => {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        console.log(range?.cloneContents());
        if (range?.collapsed) {
            navigator.clipboard.writeText(target.innerHTML);
        } else {
            // from https://gist.github.com/gleuch/2475825
            // basicly we create a div and give it the selected document-fragment,
            // so we can get document.innerHTML
            const div = document.createElement("div");
            div.appendChild(range?.cloneContents().cloneNode(true));
            console.log("clipboard: ", div.innerHTML);
            navigator.clipboard.writeText(div.innerHTML);
        }
    };
}

/**
 * calling the **deprecated** api 'execCommand', it's the most viable
 * way to handle copy/paste.
 * It's officially deprecated without alternatives, if you want to refactor it,
 * go check _copy and _paste
 */
export function copy() {
    return () => {
        document.execCommand("copy");
    };
}

export function insertTextAtCursor(text: string) {
    console.log("insertTextAtCursor", text);
    const selection = window.getSelection();
    let range = selection?.getRangeAt(0);
    range?.deleteContents();
    let node = document.createElement("span");
    node.innerHTML = text;
    range?.insertNode(node);
}

export function _paste(event: PointerEvent | MouseEvent) {
    // see https://stackoverflow.com/questions/2920150/insert-text-at-cursor-in-a-content-editable-div
    return () => {
        navigator.clipboard.read().then((value) => {
            const item = value[0];
            console.log(item.types);
            item.getType("text/plain").then((val) => {
                val.text().then((text) => {
                    DOMPurify.sanitize(text, { FORBID_ATTR: ["style"] });
                    insertTextAtCursor(text);
                });
            });
            return;
        });
    };
}

export function paste() {
    return () => {
        document.execCommand("paste");
    };
}

export function addEmoji(event: MouseEvent | PointerEvent) {
    const target = event.target as HTMLImageElement;
    const src = target?.src;
    const chars = src.split("/");
    const md5 = chars[chars.length - 1].split(".")[0];
    return () => {
        window.emoji.addEmoji(md5, src);
    };
}

export function unmountContextMenu() {
    if (contextComponent && container) {
        render(null, container);
    }
    contextComponent = null;
}
