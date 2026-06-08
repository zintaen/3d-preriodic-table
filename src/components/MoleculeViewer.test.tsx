import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MoleculeViewer } from './MoleculeViewer';

// Mock 3dmol since JSDOM doesn't support WebGL well
vi.mock('3dmol', () => ({
  createViewer: vi.fn(() => ({
    clear: vi.fn(),
    addModel: vi.fn(),
    setStyle: vi.fn(),
    zoomTo: vi.fn(),
    render: vi.fn(),
  })),
  elementColors: { rasmol: {} }
}));

describe('MoleculeViewer', () => {
  it('renders canvas container', () => {
    const { getByTestId } = render(<MoleculeViewer sdfData="fake sdf" />);
    expect(getByTestId('viewer-container')).toBeInTheDocument();
  });
});
