import type { HytaleNode } from './types';
import { ALLOWED_PROPS, TAG_MAP } from './constants';

export function htmlToJson(el: HTMLElement): HytaleNode {
    const tag = el.tagName.toLowerCase();
    const type = TAG_MAP[tag] || 'Group';

    const node: HytaleNode = {
        type: type,
        id: el.id || null
    };

    // Filtrar estilos CSS inline
    const style = el.style;
    for (let i = 0; i < style.length; i++) {
        const prop = style[i];
        if (ALLOWED_PROPS[prop]) {
            const key = ALLOWED_PROPS[prop];
            let val = style.getPropertyValue(prop).replace('px', '').trim();
            (node as any)[key] = val;
        }
    }

    // Extraer texto
    if (type === "Label" || type === "TextButton") {
        node.text = el.innerText.trim();
    }

    // Procesar hijos recursivamente
    if (el.children.length > 0) {
        node.children = Array.from(el.children).map(child => htmlToJson(child as HTMLElement));
    }

    return node;
}