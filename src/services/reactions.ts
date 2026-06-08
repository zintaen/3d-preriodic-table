// Predefined visually stunning reactions for the sandbox

export type ReactionEffect = 'explosion' | 'fire' | 'flash' | 'bubbles' | 'glow' | 'none';

export interface ReactionResult {
  equation: string;
  effect: ReactionEffect;
  description: string;
}

export const checkReaction = (reagentA: string, reagentB: string): ReactionResult => {
  const pair = [reagentA.toLowerCase(), reagentB.toLowerCase()].sort().join('+');

  switch (pair) {
    // Alkali metals + Water
    case 'h2o+na':
    case 'h2o+sodium':
      return {
        equation: '2Na + 2H₂O → 2NaOH + H₂',
        effect: 'explosion',
        description: 'Sodium reacts violently with water, releasing hydrogen gas and heat, often causing an explosion.'
      };
    case 'h2o+k':
    case 'h2o+potassium':
      return {
        equation: '2K + 2H₂O → 2KOH + H₂',
        effect: 'explosion',
        description: 'Potassium reacts extremely violently with water, igniting the hydrogen gas with a purple flame.'
      };
    case 'cs+h2o':
    case 'cesium+h2o':
      return {
        equation: '2Cs + 2H₂O → 2CsOH + H₂',
        effect: 'explosion',
        description: 'Cesium shatters the beaker! The reaction is explosively fast and incredibly violent.'
      };

    // Combustion
    case 'h+o':
    case 'hydrogen+oxygen':
    case 'h2+o2':
      return {
        equation: '2H₂ + O₂ → 2H₂O',
        effect: 'fire',
        description: 'Hydrogen burns in oxygen to produce water vapor.'
      };
    case 'c+o':
    case 'carbon+oxygen':
    case 'c+o2':
      return {
        equation: 'C + O₂ → CO₂',
        effect: 'glow',
        description: 'Carbon burns with a steady glow to produce carbon dioxide.'
      };
    case 'mg+o':
    case 'magnesium+oxygen':
    case 'mg+o2':
      return {
        equation: '2Mg + O₂ → 2MgO',
        effect: 'flash',
        description: 'Magnesium burns with an incredibly bright, blinding white light.'
      };

    // Halogens
    case 'cl+na':
    case 'chlorine+sodium':
      return {
        equation: '2Na + Cl₂ → 2NaCl',
        effect: 'flash',
        description: 'A highly exothermic reaction producing common table salt.'
      };

    // Acids
    case 'hcl+zn':
    case 'hcl+zinc':
      return {
        equation: 'Zn + 2HCl → ZnCl₂ + H₂',
        effect: 'bubbles',
        description: 'Zinc dissolves in hydrochloric acid, bubbling vigorously as it releases hydrogen gas.'
      };

    // Inert
    case 'au+h2o':
    case 'h2o+pt':
    case 'ar+h2o':
    case 'h2o+he':
      return {
        equation: 'No Reaction',
        effect: 'none',
        description: 'These substances are inert to each other under normal conditions.'
      };

    default:
      return {
        equation: 'No apparent reaction',
        effect: 'none',
        description: 'Mixing these two doesn\'t produce a violent or obvious chemical reaction.'
      };
  }
};
