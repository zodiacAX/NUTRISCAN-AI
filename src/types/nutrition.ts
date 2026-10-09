export type ScanType = 'packaged' | 'cooked_meal';

export type ProvenanceType = 
  | 'extracted_label' 
  | 'matched_database' 
  | 'estimated_ai' 
  | 'needs_verification';

export type AnalysisStatus = 
  | 'analyzed' 
  | 'partially_verified' 
  | 'estimated' 
  | 'needs_verification';

export interface NutritionMetric {
  value: number | null;
  unit: 'kcal' | 'g' | 'mg' | 'mcg';
  provenance: ProvenanceType;
  confidence: number;
  dailyValuePercentage?: number | null;
  sourceNote?: string;
}

export interface NutritionData {
  calories: NutritionMetric;
  protein: NutritionMetric;
  carbohydrates: NutritionMetric;
  totalSugar: NutritionMetric;
  addedSugar?: NutritionMetric;
  totalFat: NutritionMetric;
  saturatedFat: NutritionMetric;
  transFat?: NutritionMetric;
  dietaryFiber?: NutritionMetric;
  sodium: NutritionMetric;
  potassium?: NutritionMetric;
  calcium?: NutritionMetric;
  iron?: NutritionMetric;
}

export interface ExtractedIngredient {
  name: string;
  purpose?: string;
  isAdditive: boolean;
  riskLevel?: 'safe' | 'caution' | 'moderate';
  description?: string;
  sourceECode?: string;
}

export interface IngredientsAnalysis {
  rawExtractedText: string;
  extractedIngredients: ExtractedIngredient[];
  declaredAllergens: string[];
  crossContaminationWarnings: string[];
  allergenCautionMessage: string;
  unreadableSections?: string[];
}

export interface FoodSafetyInfo {
  dateType: 'best_before' | 'use_by' | 'expiry' | 'not_detected';
  dateExtracted: string | null;
  dateRawSnippet?: string;
  isDateAmbiguous: boolean;
  storageInstructions: string | null;
  packagingIntegrityNotes?: string;
  recallStatus: {
    checked: boolean;
    hasRecalls: boolean;
    source?: string;
    details?: string;
  };
  safetyDisclaimer: string;
}

export interface EvidenceItem {
  id: string;
  claim: string;
  provenance: ProvenanceType;
  extractedSnippet: string;
  locationOnPackage?: string;
  externalSource?: {
    name: string;
    url?: string;
    referenceId: string;
  };
}

export interface NutritionInterpretation {
  keyTakeaways: Array<{
    title: string;
    description: string;
    sentiment: 'neutral' | 'positive' | 'warning';
    metricTag?: string;
  }>;
  processingLevel: {
    novaGroup: 1 | 2 | 3 | 4;
    label: string;
    explanation: string;
    markers: string[];
  };
  dietarySuitability: {
    vegan?: boolean;
    vegetarian?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
    ketoFriendly?: boolean;
  };
}

export interface Recommendation {
  id: string;
  title: string;
  action: string;
  rationale: string;
  iconType: 'compare' | 'portion' | 'check' | 'alternative';
}

export interface FoodScanResult {
  id: string;
  name: string;
  brand?: string;
  category: string;
  scanType: ScanType;
  timestamp: string;
  imageUrl: string;
  status: AnalysisStatus;
  confidenceScore: number;
  servingBasis: string;
  servingSizeGrams?: number;
  servingsPerContainer?: number;
  nutrition: NutritionData;
  interpretation: NutritionInterpretation;
  ingredientsAnalysis: IngredientsAnalysis;
  foodSafety: FoodSafetyInfo;
  evidenceItems: EvidenceItem[];
  recommendations: Recommendation[];
  suggestedQuestions: string[];
  isDemoSample?: boolean;
  databaseMatched?: Record<string, unknown>;
}

export interface ScanWorkspaceSettings {
  foodType: ScanType;
  packagedFocus: 'front' | 'ingredients' | 'nutrition' | 'expiry' | 'all';
  cookedContext?: string;
  servingPortionContext?: string;
  scanMode: 'full' | 'allergen_only' | 'macro_quick';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
  unsupportedQueryWarning?: boolean;
}

export interface AppSettings {
  useDemoMode: boolean;
  apiKey?: string;
  apiEndpoint?: string;
  language: 'en' | 'es' | 'fr' | 'de';
  saveScansLocally: boolean;
}
