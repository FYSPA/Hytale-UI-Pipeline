import type { HytaleNode } from './types';
import { ALLOWED_PROPS, TAG_MAP } from './constants';

export function htmlToJson(el: HTMLElement): HytaleNode {
    const tag = el.tagName.toLowerCase();
    const type = TAG_MAP[tag] || 'Group';

    const node: HytaleNode = {
        type: type,
        id: el.id || null
    };

    // Usamos el estilo inline directamente para evitar que el navegador meta ruido
    const inlineStyle = el.style;
    const computedStyle = window.getComputedStyle(el);

    Object.keys(ALLOWED_PROPS).forEach(cssProp => {
        const hytaleKey = ALLOWED_PROPS[cssProp];

        // Prioridad absoluta a lo que el usuario escribe en el editor (inline)
        let val = inlineStyle.getPropertyValue(cssProp);

        // Solo usamos computedStyle para el ancho/alto si no están definidos
        if (!val && (cssProp === 'width' || cssProp === 'height')) {
            val = computedStyle.getPropertyValue(cssProp);
        }

        if (val && val !== 'initial' && val !== 'none' && val !== 'auto') {
            (node as any)[hytaleKey] = val.replace('px', '').trim();
        }
    });

    if (type === "Label" || type === "TextButton") {
        node.text = el.innerText.trim();
    }

    if (el.children.length > 0) {
        node.children = Array.from(el.children).map(child => htmlToJson(child as HTMLElement));
    }

    return node;
}