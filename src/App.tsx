import React, { useState, useEffect } from 'react';
import type { FoodScanResult, AppSettings, ScanType } from './types/nutrition';
import { Navbar, type ActiveTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { QuickStartCards } from './components/home/QuickStartCards';
import { SampleShowcase } from './components/home/SampleShowcase';
import { RecentScansSection } from './components/home/RecentScansSection';
import { TrustSection } from './components/home/TrustSection';
import { ScanWorkspace } from './components/scan/ScanWorkspace';
import { FoodAnalysisResults } from './components/results/FoodAnalysisResults';
import { ProductComparison } from './components/compare/ProductComparison';
import { ScanHistory } from './components/history/ScanHistory';
import { SettingsModal } from './components/settings/SettingsModal';
import { ToastContainer, type ToastMessage } from './components/common/Toast';
import {
  getScanHistory,
  saveScanToHistory,
  deleteScanFromHistory,
  clearAllHistory,
  getSavedSettings,
  saveSettings
} from './services/historyStorage';
import { SAMPLE_FOODS } from './data/sampleFoods';
import { Sparkles, X, Home, Camera, Scale, History } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [history, setHistory] = useState<FoodScanResult[]>([]);
  const [activeFoodResult, setActiveFoodResult] = useState<FoodScanResult | null>(null);
  const [initialScanType, setInitialScanType] = useState<ScanType>('packaged');
  const [comparisonPair, setComparisonPair] = useState<{
    productA?: FoodScanResult;
    productB?: FoodScanResult;
  }>({});
  const [settings, setSettings] = useState<AppSettings>(getSavedSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  // Initialize history on mount
  useEffect(() => {
    const loaded = getScanHistory();
    setHistory(loaded);
    // Default active result to first sample if available for seamless preview
    if (!activeFoodResult && loaded.length > 0) {
      setActiveFoodResult(loaded[0]);
    }
  }, []);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message
    };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // User completes a food scan
  const handleScanComplete = (result: FoodScanResult) => {
    saveScanToHistory(result);
    setHistory(getScanHistory());
    setActiveFoodResult(result);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('success', 'Food Analysis Complete', `Successfully extracted nutrition intelligence for ${result.name}.`);
  };

  // Inspect curated sample
  const handleSelectSample = (sample: FoodScanResult) => {
    setActiveFoodResult(sample);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('info', 'Loaded Sample Food', `Showing full verified report for ${sample.name}.`);
  };

  // Launch compare from report
  const handleCompareFromReport = (food: FoodScanResult) => {
    // Pick another product to pair with
    const alternate = history.find(item => item.id !== food.id) || SAMPLE_FOODS[1];
    setComparisonPair({ productA: food, productB: alternate });
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete scan from history
  const handleDeleteScan = (id: string) => {
    const updated = deleteScanFromHistory(id);
    setHistory(updated);
    addToast('info', 'Scan Deleted', 'Removed item from your local scan history.');
  };

  // Clear all scans
  const handleClearAllHistory = () => {
    clearAllHistory();
    setHistory([]);
    addToast('warning', 'History Cleared', 'All stored food scans have been deleted.');
  };

  // Update Settings
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    addToast('success', 'Settings Updated', `Mode set to ${newSettings.useDemoMode ? 'Demo Adapter' : 'Live Gateway'}.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4E9] text-[#1D2921]">
      {/* Persistent Demo Mode Disclosure Banner */}
      {settings.useDemoMode && showDemoBanner && (
        <aside
          aria-label="Demo Mode Notice"
          className="bg-[#FEF7ED] border-b border-[#A65D12]/20 px-4 py-2 text-xs text-[#A65D12] flex items-center justify-between no-print z-50 sticky top-0"
        >
          <div className="max-w-7xl mx-auto flex items-center gap-2 w-full justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#A65D12] shrink-0" />
              <span>
                <strong>MLH Hackathon Demo Adapter Active:</strong> Real multi-stage OCR simulation enabled with zero API key requirement.
              </span>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="underline font-semibold ml-1.5 hover:text-[#7f440a]"
              >
                Configure Live Gemma 4 API
              </button>
            </div>
            <button
              onClick={() => setShowDemoBanner(false)}
              className="text-[#A65D12] hover:text-black p-0.5 rounded ml-2"
              aria-label="Dismiss banner"
            >
              <X size={14} />
            </button>
          </div>
        </aside>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDemoMode={settings.useDemoMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <HeroSection
              onScanClick={() => {
                setInitialScanType('packaged');
                setActiveTab('scan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onTrySampleClick={() => {
                const target = document.getElementById('sample-section');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleSelectSample(SAMPLE_FOODS[0]);
                }
              }}
            />

            <QuickStartCards
              onSelectAction={(action) => {
                if (action === 'packaged') {
                  setInitialScanType('packaged');
                  setActiveTab('scan');
                } else if (action === 'cooked_meal') {
                  setInitialScanType('cooked_meal');
                  setActiveTab('scan');
                } else {
                  setActiveTab('compare');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <SampleShowcase onSelectSample={handleSelectSample} />

            <RecentScansSection
              history={history}
              onOpenReport={(item) => {
                setActiveFoodResult(item);
                setActiveTab('results');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateScan={() => {
                setActiveTab('scan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateHistory={() => {
                setActiveTab('history');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDeleteScan={handleDeleteScan}
            />

            <TrustSection />
          </div>
        )}

        {activeTab === 'scan' && (
          <ScanWorkspace
            onScanComplete={handleScanComplete}
            isDemoMode={settings.useDemoMode}
            apiKey={settings.apiKey}
            initialScanType={initialScanType}
          />
        )}

        {activeTab === 'results' && activeFoodResult && (
          <FoodAnalysisResults
            food={activeFoodResult}
            onScanAnother={() => {
              setActiveTab('scan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCompareWithAnother={handleCompareFromReport}
          />
        )}

        {activeTab === 'compare' && (
          <ProductComparison
            availableFoods={history.length > 0 ? history : SAMPLE_FOODS}
            initialProductA={comparisonPair.productA}
            initialProductB={comparisonPair.productB}
            onSelectFoodToView={(food) => {
              setActiveFoodResult(food);
              setActiveTab('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'history' && (
          <ScanHistory
            history={history}
            onOpenReport={(food) => {
              setActiveFoodResult(food);
              setActiveTab('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDeleteScan={handleDeleteScan}
            onClearAll={handleClearAllHistory}
            onNavigateScan={() => {
              setActiveTab('scan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Settings & Model Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Mobile Bottom Navigation Dock (Inspired by Mobile Reference) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8E0] px-6 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-[#163D2B] font-bold' : 'text-[#68736B]'
          }`}
        >
          <Home size={19} />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('scan');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="relative -top-4 w-12 h-12 rounded-full bg-[#163D2B] text-white flex items-center justify-center shadow-md shadow-[#163D2B]/30 hover:bg-[#0F2A1E] transition-all cursor-pointer"
          title="Scan Food"
        >
          <Camera size={22} />
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('compare');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'compare' ? 'text-[#163D2B] font-bold' : 'text-[#68736B]'
          }`}
        >
          <Scale size={19} />
          <span>Compare</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('history');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'history' ? 'text-[#163D2B] font-bold' : 'text-[#68736B]'
          }`}
        >
          <History size={19} />
          <span>History</span>
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#3D7954] text-white text-[9px] font-bold flex items-center justify-center">
              {history.length}
            </span>
          )}
        </button>
      </nav>

      {/* Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
};

export default App;
