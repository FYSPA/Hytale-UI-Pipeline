import './global.css';
import * as monaco from 'monaco-editor';
import { emmetHTML } from 'emmet-monaco-es';
import { htmlToJson } from './lib/parser';
import { jsonToHytale } from './lib/generator';

// 1. Configuración de Workers para Vite (Esto es lo que realmente importa)
import selfWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

(window as any).MonacoEnvironment = {
    getWorker(_: any, label: string) {
        if (label === 'json') return new jsonWorker();
        if (label === 'html') return new htmlWorker();
        return new selfWorker();
    }
};

// --- CONFIGURACIÓN DE LENGUAJE ---
// Usamos una comprobación de seguridad para evitar errores de tipos en TS
const lang = (monaco.languages as any);
if (lang.html && lang.html.htmlDefaults) {
    lang.html.htmlDefaults.setOptions({
        format: { tabSize: 4, insertSpaces: true },
        suggest: { html5: true }
    });
}

// 2. Crear los Editores
const htmlEditor = monaco.editor.create(document.getElementById('htmlEditor')!, {
    value: `<div id="Panel" style="width: 300px; background-color: #000;">\n  <span style="color: #FFD700; font-size: 18px;">Hytale UI</span>\n</div>`,
    language: 'html',
    theme: 'vs-dark',
    automaticLayout: true,
    fontSize: 14,
    minimap: { enabled: false },
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    formatOnType: true,
    tabCompletion: 'on'
});

const jsonEditor = monaco.editor.create(document.getElementById('jsonEditor')!, {
    value: '',
    language: 'json',
    theme: 'vs-dark',
    readOnly: true,
    automaticLayout: true,
    minimap: { enabled: false }
});

const hytaleEditor = monaco.editor.create(document.getElementById('hytaleEditor')!, {
    value: '',
    language: 'cpp',
    theme: 'vs-dark',
    readOnly: true,
    automaticLayout: true,
    minimap: { enabled: false }
});

// --- ACTIVAR EMMET ---
// Esto habilita el autocompletado pro: 'div' + TAB -> '<div></div>'
emmetHTML(monaco);

const visualContent = document.querySelector<HTMLDivElement>('#visualContent')!;

// 3. Lógica de procesamiento
function procesar() {
    try {
        const htmlText = htmlEditor.getValue();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // HTML -> JSON
        const jsonData = Array.from(doc.body.children).map(el => htmlToJson(el as HTMLElement));
        jsonEditor.setValue(JSON.stringify(jsonData, null, 2));

        // JSON -> HYTALE
        let hytaleCode = "// Hytale UI Generated\n\n";
        jsonData.forEach(item => {
            hytaleCode += jsonToHytale(item);
        });
        hytaleEditor.setValue(hytaleCode);

        // Preview Visual
        visualContent.innerHTML = htmlText;
    } catch (err) {
        console.warn("Error parseando HTML:", err);
    }
}

// 4. Listeners
htmlEditor.onDidChangeModelContent(() => procesar());

// Inicialización
procesar();