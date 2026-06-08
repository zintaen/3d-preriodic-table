import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrbitalViewer } from './OrbitalViewer';

// Mock Canvas since WebGL context isn't available in JSDOM
vi.mock('@react-three/fiber', () => {
  return {
    Canvas: ({ children }: any) => <div data-testid="r3f-canvas">{children}</div>,
    useFrame: vi.fn(),
  };
});

describe('OrbitalViewer', () => {
  it('renders R3F canvas container', () => {
    const { getByTestId } = render(<OrbitalViewer n={1} l={0} ml={0} />);
    expect(getByTestId('r3f-canvas')).toBeInTheDocument();
  });
});
