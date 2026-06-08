export interface ElementData {
  AtomicNumber: number;
  Symbol: string;
  Name: string;
  AtomicMass: number;
  AtomicRadius?: number;
  Electronegativity?: number;
  Period: number;
  ElectronConfiguration?: string;
  Category?: string;
  YearDiscovered?: string;
  IonizationEnergy?: number;
}

const PERIOD_BOUNDARIES = [
  { max: 2, period: 1 },
  { max: 10, period: 2 },
  { max: 18, period: 3 },
  { max: 36, period: 4 },
  { max: 54, period: 5 },
  { max: 86, period: 6 },
  { max: 118, period: 7 },
];

export const getPeriod = (atomicNumber: number): number => {
  for (const b of PERIOD_BOUNDARIES) {
    if (atomicNumber <= b.max) return b.period;
  }
  return 8; // Extended
};

let cachedPeriodicTable: ElementData[] | null = null;
const sdfCache = new Map<string, string>();

export const fetchPeriodicTable = async (): Promise<ElementData[]> => {
  if (cachedPeriodicTable) {
    return cachedPeriodicTable;
  }
  const response = await fetch('/api/pubchem/periodictable/JSON');
  if (!response.ok) {
    throw new Error('Failed to fetch periodic table');
  }
  const json = await response.json();
  const rows = json.Table.Row;
  
  const parsed: ElementData[] = rows.map((row: any) => {
    const cells = row.Cell;
    const atomicNumber = parseInt(cells[0], 10);
    return {
      AtomicNumber: atomicNumber,
      Symbol: cells[1],
      Name: cells[2],
      AtomicMass: parseFloat(cells[3]),
      ElectronConfiguration: cells[5],
      Electronegativity: cells[6] ? parseFloat(cells[6]) : undefined,
      AtomicRadius: cells[7] ? parseFloat(cells[7]) : undefined,
      IonizationEnergy: cells[8] ? parseFloat(cells[8]) : undefined,
      Category: cells[15],
      YearDiscovered: cells[16],
      Period: getPeriod(atomicNumber)
    };
  });

  cachedPeriodicTable = parsed;
  return parsed;
};
export const getElementByAtomicNumber = async (z: number): Promise<ElementData | null> => {
  const table = await fetchPeriodicTable();
  return table.find(e => e.AtomicNumber === z) || null;
};

export const fetchCompoundSDF = async (name: string): Promise<string> => {
  const normalizedName = name.toLowerCase().trim();
  if (sdfCache.has(normalizedName)) {
    return sdfCache.get(normalizedName)!;
  }
  const response = await fetch(`/api/pubchem/compound/name/${encodeURIComponent(normalizedName)}/SDF`);
  if (!response.ok) {
    throw new Error(`Failed to fetch SDF for ${name}`);
  }
  const text = await response.text();
  sdfCache.set(normalizedName, text);
  return text;
};
