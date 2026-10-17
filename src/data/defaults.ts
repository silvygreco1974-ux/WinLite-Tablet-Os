import { CustomWebApp, StickyNote, SystemSettings, VirtualFile, WallpaperOption } from '../types/os';

export const DEFAULT_WALLPAPERS: WallpaperOption[] = [
  {
    id: 'win11-bloom-dark',
    name: 'Windows Bloom Scuro',
    url: 'linear-gradient(135deg, #0a1128 0%, #101f42 35%, #1e3a8a 70%, #0d1b2a 100%)',
    previewUrl: 'linear-gradient(135deg, #0a1128, #1e3a8a)',
    type: 'dark'
  },
  {
    id: 'win11-bloom-light',
    name: 'Windows Bloom Chiaro',
    url: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 30%, #bfdbfe 60%, #e0f2fe 100%)',
    previewUrl: 'linear-gradient(135deg, #e0e7ff, #bfdbfe)',
    type: 'light'
  },
  {
    id: 'aurora-sunset',
    name: 'Aurora Tramonto',
    url: 'linear-gradient(135deg, #0f172a 0%, #311042 40%, #701a75 75%, #0369a1 100%)',
    previewUrl: 'linear-gradient(135deg, #0f172a, #701a75)',
    type: 'dark'
  },
  {
    id: 'emerald-flow',
    name: 'Smeraldo Nordico',
    url: 'linear-gradient(135deg, #022c22 0%, #064e3b 40%, #047857 70%, #0f172a 100%)',
    previewUrl: 'linear-gradient(135deg, #022c22, #047857)',
    type: 'dark'
  },
  {
    id: 'cyber-minimal',
    name: 'Minimal Deep Slate',
    url: 'linear-gradient(135deg, #090d16 0%, #111827 50%, #1f2937 100%)',
    previewUrl: 'linear-gradient(135deg, #090d16, #1f2937)',
    type: 'dark'
  },
  {
    id: 'warm-sand',
    name: 'Duna Chiara',
    url: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 35%, #fed7aa 70%, #f3f4f6 100%)',
    previewUrl: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
    type: 'light'
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  wallpaper: DEFAULT_WALLPAPERS[0].url,
  theme: 'dark',
  accentColor: '#0078d4', // Windows Blue
  tabletMode: true,
  singleTapOpen: true, // Default to single tap for tablet touch screens!
  soundEnabled: true,
  desktopIconPositions: {},
};

export const INITIAL_WEB_APPS: CustomWebApp[] = [
  {
    id: 'web-wikipedia',
    name: 'Wikipedia',
    url: 'https://it.wikipedia.org',
    icon: 'BookOpen',
    color: '#3366cc',
    category: 'Studio',
    openMode: 'window',
    isPinnedDesktop: true,
    isPinnedTaskbar: false,
    addedAt: new Date().toISOString()
  },
  {
    id: 'web-excalidraw',
    name: 'Excalidraw',
    url: 'https://excalidraw.com',
    icon: 'PenTool',
    color: '#6965db',
    category: 'Lavoro',
    openMode: 'window',
    isPinnedDesktop: true,
    isPinnedTaskbar: true,
    addedAt: new Date().toISOString()
  },
  {
    id: 'web-calculator',
    name: 'Desmos Grafica',
    url: 'https://www.desmos.com/calculator?lang=it',
    icon: 'Activity',
    color: '#2e7d32',
    category: 'Studio',
    openMode: 'window',
    isPinnedDesktop: false,
    isPinnedTaskbar: false,
    addedAt: new Date().toISOString()
  },
  {
    id: 'web-translate',
    name: 'Traduttore',
    url: 'https://www.deepl.com/translator',
    icon: 'Globe',
    color: '#0f2b46',
    category: 'Utilità',
    openMode: 'tab',
    isPinnedDesktop: false,
    isPinnedTaskbar: false,
    addedAt: new Date().toISOString()
  },
  {
    id: 'web-github',
    name: 'GitHub',
    url: 'https://github.com',
    icon: 'Code2',
    color: '#24292e',
    category: 'Lavoro',
    openMode: 'tab',
    isPinnedDesktop: false,
    isPinnedTaskbar: false,
    addedAt: new Date().toISOString()
  }
];

export const INITIAL_STICKY_NOTES: StickyNote[] = [
  {
    id: 'sticky-1',
    title: '💡 Benvenuto su WinLite Tablet',
    content: 'Questo ambiente è ottimizzato per il tuo tablet:\n- Non occupa spazio su disco (salvataggio leggero nel browser)\n- Puoi scrivere documenti, codificare, prendere appunti\n- Aggiungi qualsiasi sito o web app esterna!',
    color: 'yellow',
    x: 28,
    y: 80,
    width: 280,
    height: 240,
    isPinnedToDesktop: true,
    isChecklist: false,
    checklistItems: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sticky-2',
    title: '📝 Cose da Fare',
    content: '',
    color: 'green',
    x: 320,
    y: 80,
    width: 260,
    height: 220,
    isPinnedToDesktop: true,
    isChecklist: true,
    checklistItems: [
      { id: 'item-1', text: 'Provare l\'Editor di Testo', done: false },
      { id: 'item-2', text: 'Scrivere codice in Code Studio', done: false },
      { id: 'item-3', text: 'Aggiungere le mie Web App preferite', done: true },
      { id: 'item-4', text: 'Attivare Schermo Intero per il tablet', done: false }
    ],
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_FILES: VirtualFile[] = [
  {
    id: 'file-doc-1',
    name: 'Guida Tablet WinLite',
    type: 'document',
    extension: 'txt',
    folder: 'documents',
    size: 1420,
    updatedAt: new Date().toISOString(),
    content: `BENVENUTO NEL TUO SPAZIO DESKTOP VIRTUALE PER TABLET

Perché questa soluzione è ideale per chi ha poca memoria sul tablet?
1. Zero app pesanti installate sul sistema operativo del tablet.
2. I file, gli appunti e le tue preferenze vengono salvati nella memoria ultra-leggera del browser (LocalStorage / IndexedDB).
3. Puoi esportare in qualsiasi momento un backup di tutto con un click.

CARATTERISTICHE PRINCIPALI:
- Editor di Testo: formattazione ricca, conteggio parole, esportazione .txt e .html, stampa/pdf.
- Editor di Codice: supporto HTML, CSS, JavaScript, Python, JSON, con anteprima interattiva dal vivo!
- Note Adesive: sticky notes colorate con liste di controllo to-do posizionabili sul desktop.
- Web App Personalizzate: salva qualsiasi indirizzo web (es. Notion, YouTube, Canva, Google Drive) e aprilo come se fosse un'app nativa!

Buon lavoro e buona navigazione!`
  },
  {
    id: 'file-code-1',
    name: 'esempio_widget',
    type: 'code',
    extension: 'html',
    language: 'html',
    folder: 'code',
    size: 980,
    updatedAt: new Date().toISOString(),
    content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      color: white;
    }
    .card {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      padding: 30px;
      border-radius: 16px;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    button {
      background: white;
      color: #1e3a8a;
      border: none;
      padding: 10px 20px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>🚀 Ciao dal tuo tablet!</h2>
    <p>Questo codice HTML/JS gira in diretta nel Code Editor.</p>
    <button onclick="saluta()">Clicca qui</button>
    <p id="msg" style="margin-top:12px; font-weight:bold;"></p>
  </div>

  <script>
    function saluta() {
      document.getElementById('msg').innerText = 'Funziona alla perfezione! ✨ ' + new Date().toLocaleTimeString();
    }
  </script>
</body>
</html>`
  }
];
