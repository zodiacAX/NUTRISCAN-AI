import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState } from '../components/scan/LoadingState';
import { IngredientList } from '../components/results/IngredientList';
import { ProductHeader } from '../components/results/ProductHeader';
import { SAMPLE_FOODS } from '../data/sampleFoods';

describe('UI Components & Disclosures', () => {
  it('renders LoadingState with all 5 honest progress stages', () => {
    render(
      <LoadingState
        progress={{
          stage: 3,
          stageName: 'Analyzing nutrition details',
          percentage: 65,
          message: 'Extracting tokens'
        }}
      />
    );

    expect(screen.getByText('Analyzing Food Intelligence')).toBeTruthy();
    expect(screen.getByText('Processing image')).toBeTruthy();
    expect(screen.getByText('Reading visible food information')).toBeTruthy();
    expect(screen.getAllByText('Analyzing nutrition details').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Checking available reference data')).toBeTruthy();
    expect(screen.getByText('Preparing the report')).toBeTruthy();
  });

  it('renders prominent mandatory allergen caution message in IngredientList', () => {
    render(<IngredientList ingredientsAnalysis={SAMPLE_FOODS[0].ingredientsAnalysis} />);

    expect(screen.getByText(/Always verify the original packaging/i)).toBeTruthy();
    expect(screen.getByText(/Critical Allergy Caution/i)).toBeTruthy();
  });

  it('displays "Product not confidently identified" when product name is empty', () => {
    const unconfidentFood = {
      ...SAMPLE_FOODS[0],
      name: ''
    };

    render(
      <ProductHeader
        food={unconfidentFood}
        onScanAnother={vi.fn()}
        onCompare={vi.fn()}
        onPrint={vi.fn()}
      />
    );

    expect(screen.getByText('Product not confidently identified')).toBeTruthy();
  });
});
