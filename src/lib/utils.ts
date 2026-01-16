export function cssToHytaleColor(cssColor: string): string | null {
    // Si es transparente o no existe, devolvemos null para ignorarlo
    if (!cssColor || cssColor === 'transparent' || cssColor === 'rgba(0, 0, 0, 0)' || cssColor === 'initial') {
        return null;
    }

    if (cssColor.startsWith('#')) return cssColor;
    if (cssColor === 'black') return '#000000';

    const match = cssColor.match(/\d+/g);
    if (!match || match.length < 3) return null;

    const r = parseInt(match[0]).toString(16).padStart(2, '0');
    const g = parseInt(match[1]).toString(16).padStart(2, '0');
    const b = parseInt(match[2]).toString(16).padStart(2, '0');
    const hex = `#${r}${g}${b}`;

    // Manejo de Alpha para Hytale: #hex(0.x)
    const alphaMatch = cssColor.match(/0\.\d+|1\.0|1/);
    if (cssColor.includes('rgba') && alphaMatch && parseFloat(alphaMatch[0]) < 1) {
        return `${hex}(${alphaMatch[0]})`;
    }

    return hex;
}

export function getHytaleChatColor(hex: string | null): string {
    if (!hex) return '§f';
    const color = hex.toLowerCase().split('(')[0];
    if (color === '#000000' || color === 'black' || color === '#000') return '§0';
    return '§f';
}