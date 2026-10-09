import type { FoodScanResult, AppSettings } from '../types/nutrition';
import { SAMPLE_FOODS } from '../data/sampleFoods';

const STORAGE_KEY = 'nutriscan_history_v1';
const SETTINGS_KEY = 'nutriscan_settings_v1';

export function getScanHistory(): FoodScanResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with our realistic sample items so comparison and history are instantly rich
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_FOODS));
      return SAMPLE_FOODS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SAMPLE_FOODS;
  } catch (err) {
    console.warn("Error reading scan history from localStorage:", err);
    return SAMPLE_FOODS;
  }
}

export function saveScanToHistory(scan: FoodScanResult): void {
  try {
    const existing = getScanHistory();
    const updated = [scan, ...existing.filter(item => item.id !== scan.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save scan to history:", err);
  }
}

export function deleteScanFromHistory(id: string): FoodScanResult[] {
  try {
    const existing = getScanHistory();
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to delete scan:", err);
    return [];
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear history:", err);
  }
}

export function getSavedSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not load settings:", e);
  }
  return {
    useDemoMode: true,
    apiKey: '',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta',
    language: 'en' as const,
    saveScansLocally: true
  };
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Could not save settings:", e);
  }
}
