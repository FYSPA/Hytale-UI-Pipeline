export const ALLOWED_PROPS: Record<string, keyof Omit<import('./types').HytaleNode, 'type' | 'children' | 'id' | 'text'>> = {
    'width': 'width',
    'height': 'height',
    'background-color': 'background',
    'color': 'color',
    'font-size': 'fontSize',
    'margin-top': 'marginTop',
    'padding': 'padding'
};

export const TAG_MAP: Record<string, 'Group' | 'Label' | 'TextButton'> = {
    'div': 'Group',
    'section': 'Group',
    'span': 'Label',
    'p': 'Label',
    'label': 'Label',
    'button': 'TextButton'
};