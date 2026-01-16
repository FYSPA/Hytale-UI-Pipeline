import type { HytaleNode } from './types';

export function jsonToHytale(obj: HytaleNode, indent: number = 0): string {
    const space = "  ".repeat(indent);
    const idStr = obj.id ? ` #${obj.id}` : "";
    let res = `${space}${obj.type}${idStr} {\n`;

    if (obj.width || obj.height) {
        res += `${space}  Anchor: (Width: ${obj.width || 'Auto'}, Height: ${obj.height || 'Auto'});\n`;
    }

    if (obj.background) res += `${space}  Background: ${obj.background};\n`;
    if (obj.text) res += `${space}  Text: "${obj.text}";\n`;

    if (obj.color || obj.fontSize) {
        res += `${space}  Style: (TextColor: ${obj.color || '#ffffff'}, FontSize: ${obj.fontSize || 14});\n`;
    }

    if (obj.children) {
        obj.children.forEach(child => {
            res += jsonToHytale(child, indent + 1);
        });
    }

    res += `${space}}\n`;
    return res;
}