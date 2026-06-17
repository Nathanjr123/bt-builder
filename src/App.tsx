import { useState } from 'react';
import Header from './components/Header';
import Palette from './components/Sidebar/Palette';
import PropertyPanel from './components/Sidebar/PropertyPanel';
import Canvas from './components/Canvas/Canvas';
import ExportPanel from './components/Export/ExportPanel';
import HelpModal, { shouldAutoShowGuide } from './components/HelpModal';

export default function App() {
  const [showExport, setShowExport] = useState(true);
  const [showHelp, setShowHelp] = useState(shouldAutoShowGuide);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-slate-100">
      <Header
        showExport={showExport}
        onToggleExport={() => setShowExport((s) => !s)}
        onOpenHelp={() => setShowHelp(true)}
      />

      <div className="flex min-h-0 flex-1">
        <Palette />

        {/* Centre column: canvas above, collapsible YAML drawer below. */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1">
            <Canvas />
          </div>
          {showExport && (
            <div className="h-2/5 min-h-[180px] shrink-0 border-t border-slate-700">
              <ExportPanel />
            </div>
          )}
        </main>

        <PropertyPanel />
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
