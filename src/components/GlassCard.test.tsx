import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlassCard } from './GlassCard';

describe('GlassCard', () => {
  it('applies glassmorphism classes', () => {
    const { getByTestId } = render(<GlassCard>Content</GlassCard>);
    const div = getByTestId('glass-card');
    expect(div.className).toContain('backdrop-blur');
    expect(div).toHaveTextContent('Content');
  });
});
