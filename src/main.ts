import './global.css';
import * as monaco from 'monaco-editor';
import { emmetHTML } from 'emmet-monaco-es';
import { htmlToJson } from './lib/parser';
import { jsonToHytale } from './lib/generator';

// 1. Configuración de Workers para Vite
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

// Configuración de lenguaje
const lang = (monaco.languages as any);
if (lang.html && lang.html.htmlDefaults) {
    lang.html.htmlDefaults.setOptions({
        format: { tabSize: 4, insertSpaces: true },
        suggest: { html5: true }
    });
}

const defaultHTML = `<div id="Panel" style="width: 300px; background-color: #000;">
  <span style="color: #FFD700; font-size: 18px;">Hytale UI</span>
</div>`;

// 2. Crear los Editores - DESKTOP
const htmlEditor = monaco.editor.create(document.getElementById('htmlEditor')!, {
    value: defaultHTML,
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

// 3. Crear los Editores - MOBILE
const htmlEditorMobile = monaco.editor.create(document.getElementById('htmlEditorMobile')!, {
    value: defaultHTML,
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

const jsonEditorMobile = monaco.editor.create(document.getElementById('jsonEditorMobile')!, {
    value: '',
    language: 'json',
    theme: 'vs-dark',
    readOnly: true,
    automaticLayout: true,
    minimap: { enabled: false }
});

const hytaleEditorMobile = monaco.editor.create(document.getElementById('hytaleEditorMobile')!, {
    value: '',
    language: 'cpp',
    theme: 'vs-dark',
    readOnly: true,
    automaticLayout: true,
    minimap: { enabled: false }
});

// Activar EMMET
emmetHTML(monaco);

const visualContent = document.querySelector<HTMLDivElement>('#visualContent')!;
const visualContentMobile = document.querySelector<HTMLDivElement>('#visualContentMobile')!;

// 4. Lógica de procesamiento
function procesar(htmlText: string) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // HTML -> JSON
        const jsonData = Array.from(doc.body.children).map(el => htmlToJson(el as HTMLElement));
        const jsonString = JSON.stringify(jsonData, null, 2);

        // JSON -> HYTALE
        let hytaleCode = "// Hytale UI Generated\n\n";
        jsonData.forEach(item => {
            hytaleCode += jsonToHytale(item);
        });

        // Actualizar TODOS los editores
        jsonEditor.setValue(jsonString);
        jsonEditorMobile.setValue(jsonString);

        hytaleEditor.setValue(hytaleCode);
        hytaleEditorMobile.setValue(hytaleCode);

        // Preview Visual (ambos)
        visualContent.innerHTML = htmlText;
        visualContentMobile.innerHTML = htmlText;
    } catch (err) {
        console.warn("Error parseando HTML:", err);
    }
}

// 5. Variable para evitar loops infinitos de sincronización
let isSyncing = false;

// 6. Listeners - Sincronizar Desktop y Mobile
htmlEditor.onDidChangeModelContent(() => {
    if (!isSyncing) {
        isSyncing = true;
        const value = htmlEditor.getValue();
        htmlEditorMobile.setValue(value);
        procesar(value);
        isSyncing = false;
    }
});

htmlEditorMobile.onDidChangeModelContent(() => {
    if (!isSyncing) {
        isSyncing = true;
        const value = htmlEditorMobile.getValue();
        htmlEditor.setValue(value);
        procesar(value);
        isSyncing = false;
    }
});

// 7. Redimensionamiento al cambiar tamaño de ventana
function layoutAllEditors() {
    htmlEditor.layout();
    jsonEditor.layout();
    hytaleEditor.layout();
    htmlEditorMobile.layout();
    jsonEditorMobile.layout();
    hytaleEditorMobile.layout();
}

window.addEventListener('resize', () => {
    layoutAllEditors();
});

// Evento personalizado cuando cambias de tab
window.addEventListener('monaco-layout', () => {
    layoutAllEditors();
});

// 8. Inicialización
procesar(defaultHTML);

// Layout inicial después de un breve delay
setTimeout(() => {
    layoutAllEditors();
}, 100);