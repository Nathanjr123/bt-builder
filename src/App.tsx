import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Palette from './components/Sidebar/Palette';
import PropertyPanel from './components/Sidebar/PropertyPanel';
import Canvas from './components/Canvas/Canvas';
import ExportPanel from './components/Export/ExportPanel';
import HelpModal, { shouldAutoShowGuide } from './components/HelpModal';
import ProfileModal from './components/ProfileModal';
import { useTreeStore } from './store/useTreeStore';
import {
  getCurrentProfile,
  setCurrentProfile,
  loadProfile,
  saveProfile,
} from './services/persistence';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function App() {
  const [showExport, setShowExport] = useState(true);
  const [exportMinimized, setExportMinimized] = useState(false);
  const [profile, setProfile] = useState<string | null>(getCurrentProfile);
  const [showProfile, setShowProfile] = useState<boolean>(() => getCurrentProfile() === null);
  const [showHelp, setShowHelp] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const nodes = useTreeStore((s) => s.nodes);
  const edges = useTreeStore((s) => s.edges);
  const setTree = useTreeStore((s) => s.setTree);

  // Guards so auto-save doesn't fire while we are populating the canvas from a
  // freshly loaded profile (which would just re-save identical data).
  const loadingRef = useRef(false);
  const activeProfileRef = useRef<string | null>(profile);

  // Load a profile's saved tree into the canvas.
  const enterProfile = async (name: string) => {
    loadingRef.current = true;
    activeProfileRef.current = name;
    setProfile(name);
    setCurrentProfile(name);
    setShowProfile(false);
    try {
      const saved = await loadProfile(name);
      setTree(saved?.nodes ?? [], saved?.edges ?? []);
    } catch {
      setTree([], []);
    } finally {
      // Release the guard on the next tick, after the store update lands.
      setTimeout(() => {
        loadingRef.current = false;
      }, 0);
    }
    if (shouldAutoShowGuide()) setShowHelp(true);
  };

  // On first mount, auto-resume the remembered profile for this device.
  useEffect(() => {
    if (profile) void enterProfile(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced auto-save whenever the tree changes for the active profile.
  useEffect(() => {
    if (!profile || loadingRef.current) return;
    setSaveStatus('saving');
    const handle = setTimeout(async () => {
      try {
        await saveProfile(profile, { nodes, edges });
        setSaveStatus('saved');
      } catch {
        setSaveStatus('error');
      }
    }, 700);
    return () => clearTimeout(handle);
  }, [nodes, edges, profile]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-slate-100">
      <Header
        showExport={showExport}
        onToggleExport={() => {
          setShowExport((s) => {
            if (!s) setExportMinimized(false);
            return !s;
          });
        }}
        onOpenHelp={() => setShowHelp(true)}
        profile={profile}
        saveStatus={saveStatus}
        onSwitchProfile={() => setShowProfile(true)}
      />

      <div className="flex min-h-0 flex-1">
        <Palette />

        {/* Centre column: canvas above, collapsible YAML drawer below. */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1">
            <Canvas />
          </div>
          {showExport && (
            <div
              className={`shrink-0 border-t border-slate-700 ${
                exportMinimized ? 'h-auto' : 'h-2/5 min-h-[180px]'
              }`}
            >
              <ExportPanel
                minimized={exportMinimized}
                onToggleMinimize={() => setExportMinimized((m) => !m)}
                onClose={() => setShowExport(false)}
              />
            </div>
          )}
        </main>

        <PropertyPanel />
      </div>

      {showProfile && (
        <ProfileModal
          current={profile}
          onSelect={enterProfile}
          onClose={profile ? () => setShowProfile(false) : undefined}
        />
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
