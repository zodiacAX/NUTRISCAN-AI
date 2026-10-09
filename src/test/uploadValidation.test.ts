import { describe, it, expect } from 'vitest';
import { validateImageFile, FileValidationError } from '../services/apiService';

describe('Upload Validation Service', () => {
  it('accepts valid JPEG, PNG, and WEBP image files under 10MB', () => {
    const validJpeg = new File(['fake content'], 'label.jpg', { type: 'image/jpeg' });
    const validPng = new File(['fake content'], 'nutrition.png', { type: 'image/png' });
    const validWebp = new File(['fake content'], 'meal.webp', { type: 'image/webp' });

    expect(() => validateImageFile(validJpeg)).not.toThrow();
    expect(() => validateImageFile(validPng)).not.toThrow();
    expect(() => validateImageFile(validWebp)).not.toThrow();
  });

  it('rejects unsupported file formats like PDF or GIF with a descriptive message', () => {
    const pdfFile = new File(['fake pdf'], 'document.pdf', { type: 'application/pdf' });
    const textFile = new File(['fake text'], 'label.txt', { type: 'text/plain' });

    expect(() => validateImageFile(pdfFile)).toThrow(FileValidationError);
    expect(() => validateImageFile(pdfFile)).toThrow(/Unsupported file type/);
    expect(() => validateImageFile(textFile)).toThrow(FileValidationError);
  });

  it('rejects files exceeding the 10 MB limit', () => {
    // 11 MB file
    const elevenMb = 11 * 1024 * 1024;
    const largeFile = new File([new Uint8Array(elevenMb)], 'huge_photo.jpg', { type: 'image/jpeg' });

    expect(() => validateImageFile(largeFile)).toThrow(FileValidationError);
    expect(() => validateImageFile(largeFile)).toThrow(/exceeds the 10 MB limit/);
  });

  it('throws when file is null or undefined', () => {
    // @ts-expect-error testing invalid argument runtime safety
    expect(() => validateImageFile(null)).toThrow(FileValidationError);
  });
});
