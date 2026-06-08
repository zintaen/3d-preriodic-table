// Pre-defined visible emission spectral lines for famous elements (in nanometers, roughly 400nm - 700nm)
export const famousSpectra: Record<number, number[]> = {
  1: [410, 434, 486, 656], // Hydrogen (Balmer series)
  2: [447, 471, 492, 501, 587, 667], // Helium
  3: [460, 497, 548, 610, 670], // Lithium
  4: [440, 457, 527, 825], // Beryllium (some lines out of visible, 825 ignored if clamped)
  6: [426, 430, 473, 516, 563, 600, 658], // Carbon
  7: [415, 423, 444, 463, 500, 567, 648], // Nitrogen
  8: [418, 436, 464, 496, 533, 615, 645], // Oxygen
  10: [540, 585, 588, 603, 607, 609, 614, 626, 633, 638, 640, 650, 667, 692, 703], // Neon (famous dense red/orange spectrum)
  11: [589, 590], // Sodium (Doublet)
  12: [448, 470, 518, 552], // Magnesium
  18: [415, 420, 430, 451, 603, 641, 696], // Argon
  19: [404, 535, 583, 766, 769], // Potassium
  20: [422, 445, 558, 610, 612, 616, 643], // Calcium
  80: [404, 435, 546, 577, 579] // Mercury
};

// Pseudo-random generator for other elements
const seededRandom = (seed: number) => {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const getSpectralLines = (atomicNumber: number): number[] => {
  if (famousSpectra[atomicNumber]) {
    return famousSpectra[atomicNumber].filter(line => line >= 400 && line <= 700);
  }

  // Generate pseudo-random lines for elements not hardcoded
  const numLines = Math.floor(seededRandom(atomicNumber * 100) * 15) + 5; // 5 to 20 lines
  const lines: number[] = [];
  
  for (let i = 0; i < numLines; i++) {
    // visible spectrum roughly 400nm to 700nm
    const wavelength = 400 + Math.floor(seededRandom(atomicNumber * i * 13) * 300);
    lines.push(wavelength);
  }

  return lines.sort((a, b) => a - b);
};

// Convert wavelength to RGB (approximate algorithm)
export const wavelengthToColor = (wavelength: number): string => {
  let r = 0, g = 0, b = 0;

  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0;
    g = 1;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = -(wavelength - 645) / (645 - 580);
    b = 0;
  } else if (wavelength >= 645 && wavelength <= 780) {
    r = 1;
    g = 0;
    b = 0;
  } else {
    r = 0;
    g = 0;
    b = 0;
  }

  // Intensity falloff near vision limits
  let factor = 0;
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  } else if (wavelength >= 420 && wavelength < 700) {
    factor = 1.0;
  } else if (wavelength >= 700 && wavelength <= 780) {
    factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700);
  } else {
    factor = 0;
  }

  const gamma = 0.80;
  const R = Math.floor(Math.pow(r * factor, gamma) * 255);
  const G = Math.floor(Math.pow(g * factor, gamma) * 255);
  const B = Math.floor(Math.pow(b * factor, gamma) * 255);

  return `rgb(${R}, ${G}, ${B})`;
};
