import '@testing-library/jest-dom/vitest';

import { vi } from 'vitest';

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      // Return English mock for test matching
      if (key === 'atom.protons') return 'Protons';
      if (key === 'atom.neutrons') return 'Neutrons';
      if (key === 'atom.electrons') return 'Electrons';
      if (key === 'atom.add_proton') return '+ Proton';
      if (key === 'atom.add_neutron') return '+ Neutron';
      if (key === 'atom.add_electron') return '+ Electron';
      if (key === 'atom.reset') return 'Reset';
      return key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  }
}));

global.fetch = vi.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
) as unknown as typeof fetch;
