// src/__tests__/utils/bingo-validator.test.ts

import { BingoCardValidator } from '@/utils/bingo-validator';
import { BINGO_CARD_CONSTRAINTS } from '@/config/firebase';

// Mock da configuração do Firebase
jest.mock('@/config/firebase', () => ({
  BINGO_CARD_CONSTRAINTS: {
    dimensions: {
      rows: 5,
      cols: 5,
    },
    columnRanges: {
      min: [1, 16, 31, 46, 61],
      max: [15, 30, 45, 60, 75],
    },
  },
}));

describe('BingoCardValidator', () => {
  describe('validateCard', () => {
    it('deve aceitar uma cartela válida', () => {
      // Gera uma cartela usando o próprio gerador
      const card = BingoCardValidator.generateValidCard();
      const result = BingoCardValidator.validateCard(card);

      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('deve rejeitar cartela com dimensões erradas', () => {
      const invalidCard = [
        [1, 16, 31, 46, 61],
        [2, 17, 32, 47, 62],
        [3, 18, 33, 48, 63],
        [4, 19, 34, 49, 64], // Falta uma linha
      ];

      const result = BingoCardValidator.validateCard(invalidCard);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        `Cartela deve ter ${BINGO_CARD_CONSTRAINTS.dimensions.rows}x${BINGO_CARD_CONSTRAINTS.dimensions.cols} números`
      );
    });

    it('deve rejeitar números fora do range da coluna', () => {
      const invalidCard = [
        [1, 16, 31, 46, 61],
        [2, 17, 32, 47, 62],
        [3, 18, 33, 48, 63],
        [4, 19, 34, 49, 64],
        [5, 75, 35, 50, 65], // 75 está na coluna errada
      ];

      const result = BingoCardValidator.validateCard(invalidCard);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Número 75 inválido para coluna 2 (deve estar entre 16 e 30)'
      );
    });

    it('deve rejeitar números duplicados', () => {
      const invalidCard = [
        [1, 16, 31, 46, 61],
        [2, 17, 32, 47, 62],
        [3, 18, 33, 48, 63],
        [4, 16, 34, 49, 64], // 16 está duplicado
        [5, 20, 35, 50, 65],
      ];

      const result = BingoCardValidator.validateCard(invalidCard);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Número 16 duplicado na cartela');
    });
  });

  describe('generateValidCard', () => {
    it('deve gerar uma cartela com dimensões corretas', () => {
      const card = BingoCardValidator.generateValidCard();

      expect(card.length).toBe(BINGO_CARD_CONSTRAINTS.dimensions.rows);
      expect(card[0].length).toBe(BINGO_CARD_CONSTRAINTS.dimensions.cols);
    });

    it('deve gerar uma cartela com números nos ranges corretos', () => {
      const card = BingoCardValidator.generateValidCard();

      card.forEach((row, rowIndex) => {
        row.forEach((num, colIndex) => {
          const min = BINGO_CARD_CONSTRAINTS.columnRanges.min[colIndex];
          const max = BINGO_CARD_CONSTRAINTS.columnRanges.max[colIndex];

          expect(num).toBeGreaterThanOrEqual(min);
          expect(num).toBeLessThanOrEqual(max);
        });
      });
    });

    it('deve gerar uma cartela sem números duplicados', () => {
      const card = BingoCardValidator.generateValidCard();
      const numbers = new Set(card.flat());

      expect(numbers.size).toBe(
        BINGO_CARD_CONSTRAINTS.dimensions.rows * BINGO_CARD_CONSTRAINTS.dimensions.cols
      );
    });
  });
});
