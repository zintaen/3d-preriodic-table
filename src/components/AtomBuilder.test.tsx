import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AtomBuilder } from './AtomBuilder';
import { useGameStore } from '../store/gameStore';

describe('AtomBuilder', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('renders and interacts with store', () => {
    render(<AtomBuilder />);
    
    expect(screen.getByText('Protons: 1')).toBeInTheDocument();
    
    const addProtonBtn = screen.getByText('+ Proton');
    fireEvent.click(addProtonBtn);
    
    expect(screen.getByText('Protons: 2')).toBeInTheDocument();
    expect(screen.getByTestId('charge')).toHaveTextContent('+1');
  });
});
