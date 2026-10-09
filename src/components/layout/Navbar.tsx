import React, { useState } from 'react';
import { Leaf, Scan, GitCompare, History, Settings, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';

export type ActiveTab = 'home' | 'scan' | 'compare' | 'history' | 'results';

interface NavbarProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  isDemoMode: boolean;
  onOpenSettings: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  isDemoMode,
  onOpenSettings,
  historyCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: ActiveTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="w-10 h-10 rounded-xl bg-[#163D2B] flex items-center justify-center text-[#E4F0E5] shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Leaf size={20} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-[#163D2B] tracking-tight">NutriScan</span>
              <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E4F0E5] text-[#163D2B]">
                AI
              </span>
            </div>
            <span className="text-[11px] text-[#68736B] font-medium leading-none hidden sm:inline">
              Multimodal Food Intelligence
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => handleNav('scan')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'scan' || activeTab === 'results'
                ? 'bg-[#163D2B] text-white shadow-xs'
                : 'text-[#1D2921] hover:bg-[#F6F4E9]'
            }`}
          >
            <Scan size={16} />
            <span>Scan Food</span>
          </button>

          <button
            onClick={() => handleNav('compare')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'compare'
                ? 'bg-[#163D2B] text-white shadow-xs'
                : 'text-[#1D2921] hover:bg-[#F6F4E9]'
            }`}
          >
            <GitCompare size={16} />
            <span>Compare</span>
          </button>

          <button
            onClick={() => handleNav('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors relative ${
              activeTab === 'history'
                ? 'bg-[#163D2B] text-white shadow-xs'
                : 'text-[#1D2921] hover:bg-[#F6F4E9]'
            }`}
          >
            <History size={16} />
            <span>Food History</span>
            {historyCount > 0 && (
              <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === 'history' ? 'bg-white/25 text-white' : 'bg-[#E4F0E5] text-[#163D2B]'
              }`}>
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Section: Mode Indicator & Settings */}
        <div className="flex items-center gap-2.5">
          {/* Demo / Live Badge Indicator */}
          <button
            onClick={onOpenSettings}
            title={isDemoMode ? "Running in Demo Mode. Click to configure live Gemma 4 API." : "Connected to Live Gemma Inference."}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:scale-102 ${
              isDemoMode
                ? 'bg-[#FEF7ED] text-[#A65D12] border-[#A65D12]/30 hover:bg-[#FDEED9]'
                : 'bg-[#E4F0E5] text-[#163D2B] border-[#3D7954]/30 hover:bg-[#D5EAD7]'
            }`}
          >
            {isDemoMode ? (
              <>
                <Sparkles size={13} className="text-[#A65D12]" />
                <span>Demo Mode Active</span>
              </>
            ) : (
              <>
                <ShieldCheck size={13} className="text-[#3D7954]" />
                <span>Live Gemma 4</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-[#68736B] hover:text-[#1D2921] hover:bg-[#F6F4E9] transition-colors border border-transparent hover:border-[#E2E8E0]"
            aria-label="Settings and About"
            title="Settings & Model Info"
          >
            <Settings size={19} />
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#1D2921] hover:bg-[#F6F4E9] transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8E0] bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNav('scan')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
              activeTab === 'scan' ? 'bg-[#163D2B] text-white' : 'text-[#1D2921] hover:bg-[#F6F4E9]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Scan size={18} />
              <span>Scan Food</span>
            </div>
          </button>

          <button
            onClick={() => handleNav('compare')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
              activeTab === 'compare' ? 'bg-[#163D2B] text-white' : 'text-[#1D2921] hover:bg-[#F6F4E9]'
            }`}
          >
            <div className="flex items-center gap-3">
              <GitCompare size={18} />
              <span>Compare Products</span>
            </div>
          </button>

          <button
            onClick={() => handleNav('history')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
              activeTab === 'history' ? 'bg-[#163D2B] text-white' : 'text-[#1D2921] hover:bg-[#F6F4E9]'
            }`}
          >
            <div className="flex items-center gap-3">
              <History size={18} />
              <span>Food History</span>
            </div>
            {historyCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#E4F0E5] text-[#163D2B] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          <div className="pt-3 border-t border-[#E2E8E0] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettings();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-[#68736B] hover:bg-[#F6F4E9]"
            >
              <div className="flex items-center gap-3">
                <Settings size={17} />
                <span>Model Settings & About</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${isDemoMode ? 'bg-[#FEF7ED] text-[#A65D12]' : 'bg-[#E4F0E5] text-[#163D2B]'}`}>
                {isDemoMode ? 'Demo Mode' : 'Live'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
