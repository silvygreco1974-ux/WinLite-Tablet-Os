import { CustomWebApp, StickyNote, SystemSettings, VirtualFile, WallpaperOption } from '../types/os';

export const DEFAULT_WALLPAPERS: WallpaperOption[] = [
  {
    id: 'nordic-midnight',
    name: 'Notte Velluto e Ardesia (Riposo Occhi)',
    url: 'linear-gradient(135deg, #182232 0%, #202d44 40%, #2b3b55 75%, #18202e 100%)',
    previewUrl: 'linear-gradient(135deg, #182232, #2b3b55)',
    type: 'dark'
  },
  {
    id: 'warm-sand-dawn',
    name: 'Alba Calda e Sabbia (Zero Abbagliamento)',
    url: 'linear-gradient(135deg, #f7f3ea 0%, #ede4d1 40%, #e0d2ba 75%, #d1bf9f 100%)',
    previewUrl: 'linear-gradient(135deg, #f7f3ea, #d1bf9f)',
    type: 'light'
  },
  {
    id: 'calm-sky-soft',
    name: 'Cielo Azzurro Calmo e Delicato',
    url: 'linear-gradient(135deg, #e4ecf7 0%, #cfdef3 45%, #b5cde9 75%, #9ab9dd 100%)',
    previewUrl: 'linear-gradient(135deg, #e4ecf7, #9ab9dd)',
    type: 'light'
  },
  {
    id: 'sage-forest',
    name: 'Foresta Salvia e Menta',
    url: 'linear-gradient(135deg, #172a24 0%, #213c33 40%, #2d5246 75%, #1b3029 100%)',
    previewUrl: 'linear-gradient(135deg, #172a24, #2d5246)',
    type: 'dark'
  },
  {
    id: 'warm-amber-sunset',
    name: 'Tramonto Ambra e Velluto',
    url: 'linear-gradient(135deg, #24192b 0%, #3d2338 40%, #592d47 75%, #1f1828 100%)',
    previewUrl: 'linear-gradient(135deg, #24192b, #592d47)',
    type: 'dark'
  },
  {
    id: 'soft-charcoal',
    name: 'Ardesia Morbida Antiriflesso',
    url: 'linear-gradient(135deg, #1e2430 0%, #273142 50%, #303d52 100%)',
    previewUrl: 'linear-gradient(135deg, #1e2430, #303d52)',
    type: 'dark'
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  wallpaper: DEFAULT_WALLPAPERS[0].url,
  theme: 'dark',
  fontSizeScale: 'large', // Default to 'large' for comfortable reading for human eyes!
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
    width: 360,
    height: 320,
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
    x: 410,
    y: 80,
    width: 340,
    height: 320,
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
