export interface HytaleNode {
    type: 'Group' | 'Label' | 'TextButton';
    id?: string | null;
    width?: string;
    height?: string;
    background?: string;
    text?: string;
    fontSize?: string;
    color?: string;
    marginTop?: string;
    padding?: string;
    children?: HytaleNode[];
}