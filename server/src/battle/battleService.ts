// server/src/battle/battleService.ts
// Skip trying to load the C++ module and just use the JavaScript implementation

// Type definitions for battle result
export interface BattleResult {
    winner: number; // 0 for draw, 1 for Pokemon 1, 2 for Pokemon 2
    message: string;
  }
  
  // Battle service functions
  export const battleService = {
    /**
     * Determine battle outcome based on Pokemon types
     * @param type1 Type of the first Pokemon (fire, water, grass)
     * @param type2 Type of the second Pokemon (fire, water, grass)
     * @returns Battle result object
     */
    battle: (type1: string, type2: string): BattleResult => {
      try {
        const typeEffectiveness: Record<string, Record<string, number>> = {
          fire: { fire: 0, water: -1, grass: 1, electric: 0 },
          water: { fire: 1, water: 0, grass: -1, electric: -1 },
          grass: { fire: -1, water: 1, grass: 0, electric: 0 },
          electric: { fire: 0, water: 1, grass: 0, electric: 0 }
        };
        
        const normalizedType1 = type1.toLowerCase();
        const normalizedType2 = type2.toLowerCase();
        
        if (!typeEffectiveness[normalizedType1] || !typeEffectiveness[normalizedType2]) {
          throw new Error('Invalid Pokemon type. Valid types are: Fire, Water, Grass, Electric');
        }
        
        const result = typeEffectiveness[normalizedType1][normalizedType2];
        
        if (result > 0) {
          return {
            winner: 1,
            message: `Pokemon 1 wins! ${type1} is super effective against ${type2}!`
          };
        } else if (result < 0) {
          return {
            winner: 2,
            message: `Pokemon 2 wins! ${type2} is super effective against ${type1}!`
          };
        } else {
          return {
            winner: 0,
            message: "It's a draw! Both Pokemon are of the same type or equally matched."
          };
        }
      } catch (error) {
        console.error('Error during battle:', error);
        throw error;
      }
    }
  };
  
  export default battleService;