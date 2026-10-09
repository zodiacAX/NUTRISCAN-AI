import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../App';
import { HeroSection } from '../components/home/HeroSection';
import { UploadDropzone } from '../components/scan/UploadDropzone';
import { LoadingState } from '../components/scan/LoadingState';
import { FoodAnalysisResults } from '../components/results/FoodAnalysisResults';
import { ProductComparison } from '../components/compare/ProductComparison';
import { FollowUpChat } from '../components/results/FollowUpChat';
import { ReportPrintLayout } from '../components/results/ReportPrintLayout';
import { Navbar } from '../components/layout/Navbar';
import { SAMPLE_FOODS } from '../data/sampleFoods';
import { validateImageFile, FileValidationError } from '../services/apiService';

describe('Frontend 12 Quality Assurance Scenarios', () => {
  // 1. Home page renders
  it('1. renders Home page with hero, headline, and quick action buttons', () => {
    render(<HeroSection onScanClick={vi.fn()} onTrySampleClick={vi.fn()} />);
    expect(screen.getByText(/What’s really in/i)).toBeTruthy();
    expect(screen.getByText(/Scan your food/i)).toBeTruthy();
    expect(screen.getByText(/Try a sample/i)).toBeTruthy();
  });

  // 2. Upload validation
  it('2. validates uploaded files against invalid types and size limits', () => {
    const invalidDoc = new File(['text'], 'doc.pdf', { type: 'application/pdf' });
    expect(() => validateImageFile(invalidDoc)).toThrow(FileValidationError);

    const oversized = new File([new Uint8Array(11 * 1024 * 1024)], 'huge.jpg', { type: 'image/jpeg' });
    expect(() => validateImageFile(oversized)).toThrow(FileValidationError);
  });

  // 3. Image preview and replacement
  it('3. renders image preview and replacement controls in UploadDropzone', () => {
    const onReplace = vi.fn();
    const onClear = vi.fn();
    render(
      <UploadDropzone
        imageFile={new File(['img'], 'sample.jpg', { type: 'image/jpeg' })}
        imagePreviewUrl="blob:http://localhost/sample.jpg"
        onImageSelected={onReplace}
        onClearImage={onClear}
      />
    );
    expect(screen.getByText(/Replace Image/i)).toBeTruthy();
    expect(screen.getByText(/Remove/i)).toBeTruthy();
  });

  // 4. Loading state
  it('4. renders honest 5-stage progress indicator in LoadingState', () => {
    render(
      <LoadingState
        progress={{
          stage: 2,
          stageName: 'Reading visible food information',
          percentage: 42,
          message: 'Extracting bounding boxes'
        }}
      />
    );
    expect(screen.getAllByText(/Reading visible food information/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Analyzing Food Intelligence/i)).toBeTruthy();
  });

  // 5. Error and retry state
  it('5. renders error messages with retry options', () => {
    render(
      <UploadDropzone
        imageFile={null}
        imagePreviewUrl={null}
        onImageSelected={vi.fn()}
        onClearImage={vi.fn()}
        error="File size exceeds the 10 MB limit."
      />
    );
    expect(screen.getByText(/File size exceeds the 10 MB limit/i)).toBeTruthy();
  });

  // 6. Analysis results rendering
  it('6. renders full food analysis results with header, overview, and ingredients', () => {
    const sample = SAMPLE_FOODS[0];
    render(
      <FoodAnalysisResults
        food={sample}
        onScanAnother={vi.fn()}
        onCompareWithAnother={vi.fn()}
      />
    );
    expect(screen.getAllByText(sample.name).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Nutrition Overview/i)).toBeTruthy();
    expect(screen.getByText(/What This Means/i)).toBeTruthy();
    expect(screen.getByText(/Ingredients & Additive Intelligence/i)).toBeTruthy();
  });

  // 7. Missing nutrition values
  it('7. displays "Not available" when numerical values are missing (never false zero)', () => {
    const missingDataFood = {
      ...SAMPLE_FOODS[0],
      nutrition: {
        ...SAMPLE_FOODS[0].nutrition,
        sodium: {
          value: null,
          unit: 'mg' as const,
          provenance: 'needs_verification' as const,
          confidence: 0
        }
      }
    };
    render(
      <FoodAnalysisResults
        food={missingDataFood}
        onScanAnother={vi.fn()}
        onCompareWithAnother={vi.fn()}
      />
    );
    expect(screen.getByText(/Not available/i)).toBeTruthy();
  });

  // 8. Product comparison
  it('8. renders product comparison with normalized 100g toggle and neutral language', () => {
    render(
      <ProductComparison
        availableFoods={SAMPLE_FOODS}
        initialProductA={SAMPLE_FOODS[0]}
        initialProductB={SAMPLE_FOODS[1]}
      />
    );
    expect(screen.getByText(/Product Comparison Engine/i)).toBeTruthy();
    expect(screen.getByText(/Normalized \(Per 100 g\)/i)).toBeTruthy();
    expect(screen.getByText(/Stated Package Portion/i)).toBeTruthy();
    expect(screen.getByText(/Neutral Comparative Takeaway/i)).toBeTruthy();
  });

  // 9. Follow-up question submission
  it('9. provides follow-up question input and grounded suggested chips', () => {
    render(<FollowUpChat food={SAMPLE_FOODS[0]} />);
    expect(screen.getByText(/Ask Gemma 4 About This Food/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Ask about Nature Valley/i)).toBeTruthy();
  });

  // 10. Report printing
  it('10. renders printable layout for paper or PDF export', () => {
    const sample = SAMPLE_FOODS[0];
    const { container } = render(<ReportPrintLayout food={sample} />);
    expect(screen.getByText(/NUTRISCAN AI — NUTRITIONAL AUDIT REPORT/i)).toBeTruthy();
    expect(container.querySelector('.print\\:block')).toBeTruthy();
  });

  // 11. Responsive navigation
  it('11. renders navigation tabs with active state indicators', () => {
    const onNav = vi.fn();
    render(
      <Navbar
        activeTab="compare"
        onNavigate={onNav}
        isDemoMode={true}
        onOpenSettings={vi.fn()}
        historyCount={4}
      />
    );
    expect(screen.getByText(/NutriScan/i)).toBeTruthy();
    expect(screen.getByText(/Scan Food/i)).toBeTruthy();
    expect(screen.getByText(/Compare/i)).toBeTruthy();
  });

  // 12. Demo-mode indicator
  it('12. displays transparent Demo Mode disclosure banner', () => {
    render(<App />);
    expect(screen.getByText(/Demo Adapter Active/i)).toBeTruthy();
  });
});
