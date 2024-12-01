// src/utils/bingo-validator.ts
import { BINGO_CARD_CONSTRAINTS } from '@/config/firebase';

// Tipos
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export interface BingoCardDimensions {
  rows: number;
  cols: number;
}

export interface ColumnRange {
  min: number[];
  max: number[];
}

// Constantes
const VALIDATION_MESSAGES = {
  INVALID_DIMENSIONS: (rows: number, cols: number) => `Cartela deve ter ${rows}x${cols} números`,
  INVALID_NUMBER: (num: number, col: number, min: number, max: number) =>
    `Número ${num} inválido para coluna ${col + 1} (deve estar entre ${min} e ${max})`,
  DUPLICATE_NUMBER: (num: number) => `Número ${num} duplicado na cartela`,
} as const;

export class BingoCardValidator {
  /**
   * Valida uma cartela de bingo completa
   * @param card Matriz bidimensional representando a cartela
   * @returns Resultado da validação com possíveis erros
   */
  static validateCard(card: number[][]): ValidationResult {
    const errors: string[] = [];

    // Validações iniciais
    if (!this.validateDimensions(card)) {
      errors.push(
        VALIDATION_MESSAGES.INVALID_DIMENSIONS(
          BINGO_CARD_CONSTRAINTS.dimensions.rows,
          BINGO_CARD_CONSTRAINTS.dimensions.cols
        )
      );
      return this.createValidationResult(errors);
    }

    const usedNumbers = new Set<number>();

    // Validação por coluna
    for (let col = 0; col < BINGO_CARD_CONSTRAINTS.dimensions.cols; col++) {
      errors.push(...this.validateColumn(card, col, usedNumbers));
    }

    return this.createValidationResult(errors);
  }

  /**
   * Valida as dimensões da cartela
   */
  private static validateDimensions(card: number[][]): boolean {
    const { rows, cols } = BINGO_CARD_CONSTRAINTS.dimensions;
    return card.length === rows && card.every((row) => row.length === cols);
  }

  /**
   * Valida uma coluna específica da cartela
   */
  private static validateColumn(card: number[][], col: number, usedNumbers: Set<number>): string[] {
    const errors: string[] = [];
    const min = BINGO_CARD_CONSTRAINTS.columnRanges.min[col];
    const max = BINGO_CARD_CONSTRAINTS.columnRanges.max[col];

    for (let row = 0; row < card.length; row++) {
      const num = card[row][col];

      if (num < min || num > max) {
        errors.push(VALIDATION_MESSAGES.INVALID_NUMBER(num, col, min, max));
      }

      if (usedNumbers.has(num)) {
        errors.push(VALIDATION_MESSAGES.DUPLICATE_NUMBER(num));
      }

      usedNumbers.add(num);
    }

    return errors;
  }

  /**
   * Verifica se um número pode ser marcado na cartela
   */
  static validateNumber(number: number, column: number): boolean {
    const { min, max } = BINGO_CARD_CONSTRAINTS.columnRanges;
    return number >= min[column] && number <= max[column];
  }

  /**
   * Gera uma cartela válida de bingo
   */
  static generateValidCard(): number[][] {
    const { rows, cols } = BINGO_CARD_CONSTRAINTS.dimensions;
    const card: number[][] = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(0));

    const usedNumbers = new Set<number>();

    for (let col = 0; col < cols; col++) {
      this.fillColumn(card, col, usedNumbers);
    }

    return card;
  }

  /**
   * Preenche uma coluna da cartela com números válidos
   */
  private static fillColumn(card: number[][], col: number, usedNumbers: Set<number>): void {
    const min = BINGO_CARD_CONSTRAINTS.columnRanges.min[col];
    const max = BINGO_CARD_CONSTRAINTS.columnRanges.max[col];

    for (let row = 0; row < card.length; row++) {
      let num;
      do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (usedNumbers.has(num));

      usedNumbers.add(num);
      card[row][col] = num;
    }
  }

  /**
   * Cria um objeto de resultado de validação
   */
  private static createValidationResult(errors: string[]): ValidationResult {
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
