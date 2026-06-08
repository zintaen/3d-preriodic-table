import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPeriodicTable, fetchCompoundSDF, getPeriod } from './pubchem';

describe('PubChem Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calculates periods correctly', () => {
    expect(getPeriod(1)).toBe(1);
    expect(getPeriod(2)).toBe(1);
    expect(getPeriod(3)).toBe(2);
    expect(getPeriod(10)).toBe(2);
    expect(getPeriod(11)).toBe(3);
    expect(getPeriod(118)).toBe(7);
  });

  it('fetches periodic table and appends period', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        Table: {
          Row: [
            { Cell: ["1", "H", "Hydrogen", "1.008", "FFFFFF", "1s1", "2.2", "120"] }
          ]
        }
      })
    });

    const data = await fetchPeriodicTable();
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(data.length).toBe(1);
    expect(data[0].Symbol).toBe('H');
    expect(data[0].Period).toBe(1);
    expect(data[0].AtomicMass).toBe(1.008);
  });

  it('fetches compound SDF', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => 'V2000 fake SDF'
    });

    const sdf = await fetchCompoundSDF('water');
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(sdf).toContain('V2000');
  });
});
