import type { HytaleNode } from './types';
import { cssToHytaleColor, getHytaleChatColor } from './utils';

export function jsonToHytale(obj: HytaleNode, indent: number = 0): string {
    const space = "  ".repeat(indent);
    const idStr = obj.id ? ` #${obj.id}` : "";

    // 1. LÓGICA DE DETECCIÓN DE ESPACIADOR (Igual que antes)
    const isSpacer = obj.type === 'Group' && !obj.id && (!obj.children || obj.children.length === 0);
    if (isSpacer) {
        return `${space}Group { Anchor: (Height: ${obj.height || "20"}); }\n`;
    }

    let res = `${space}${obj.type}${idStr} {\n`;

    const isLabel = obj.type === 'Label';
    const isButton = obj.type === 'TextButton';
    const isGroup = obj.type === 'Group';

    // 2. Anchor
    const hasManualSize = (obj.width && obj.width !== 'auto') || (obj.height && obj.height !== 'auto');
    if (isGroup || isButton || hasManualSize) {
        const w = (obj.width && obj.width !== 'auto') ? obj.width : (isGroup ? "300" : "100");
        const h = (obj.height && obj.height !== 'auto') ? obj.height : (isGroup ? "200" : "30");
        res += `${space}  Anchor: (Width: ${w}, Height: ${h});\n`;
    }

    // 3. LÓGICA DE FONDO (Con corrección para botones)
    let hexBg = cssToHytaleColor(obj.background || '');

    // REGLA DE SEGURIDAD: Si es un botón y no tiene fondo definido, forzamos blanco
    if (isButton && !hexBg) {
        hexBg = '#ffffff';
    }

    if (hexBg) {
        res += `${space}  Background: ${hexBg};\n`;
    }

    if (isGroup) {
        res += `${space}  LayoutMode: Top;\n`;
        res += `${space}  Padding: (Full: ${obj.padding || "10"});\n`;
    }

    // 4. Estilos de Texto y Colores
    const hexColor = cssToHytaleColor(obj.color || '');
    const fontSize = obj.fontSize || (isLabel ? "18" : "14");

    if (isLabel) {
        if (obj.text) res += `${space}  Text: "${obj.text}";\n`;
        res += `${space}  Style: (TextColor: ${hexColor || '#ffffff'}, FontSize: ${fontSize});\n`;
    }
    else if (isButton) {
        const colorCode = getHytaleChatColor(hexColor);
        res += `${space}  Text: "${colorCode}${obj.text || 'test'}";\n`;
        res += `${space}  Style: (FontSize: ${fontSize});\n`;
    }

    if (obj.children && obj.children.length > 0) {
        res += `\n`;
        obj.children.forEach(child => {
            res += jsonToHytale(child, indent + 1);
        });
    }

    res += `${space}}\n`;
    return res;
}