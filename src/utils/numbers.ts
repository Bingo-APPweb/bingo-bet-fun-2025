// src/utils/numbers.ts
import { BINGO_CARD_CONSTRAINTS } from '@/config/firebase';

/**
 * Configurações para geração de números
 */
const NUMBER_GENERATION_CONFIG = {
  DEFAULT_BINGO_NUMBERS: 75,
  SHUFFLE_ITERATIONS: 3,
} as const;

/**
 * Tipos de erro que podem ocorrer durante a geração de números
 */
export enum NumberGenerationError {
  INVALID_RANGE = 'INVALID_RANGE',
  INVALID_COUNT = 'INVALID_COUNT',
  GENERATION_FAILED = 'GENERATION_FAILED',
}

/**
 * Interface para resultado da geração de números
 */
export interface NumberGenerationResult<T> {
  success: boolean;
  data?: T;
  error?: NumberGenerationError;
  message?: string;
}

/**
 * Gera um número aleatório dentro de um intervalo
 * @param min Valor mínimo (inclusivo)
 * @param max Valor máximo (inclusivo)
 * @returns Resultado da geração com o número ou erro
 */
export const generateRandomNumber = (min: number, max: number): NumberGenerationResult<number> => {
  try {
    // Validação de entrada
    if (min > max || !Number.isFinite(min) || !Number.isFinite(max)) {
      return {
        success: false,
        error: NumberGenerationError.INVALID_RANGE,
        message: 'Intervalo inválido para geração de número',
      };
    }

    // Geração do número usando crypto para maior aleatoriedade quando disponível
    let randomValue: number;
    if (typeof window !== 'undefined' && window.crypto) {
      const range = max - min + 1;
      const bytesNeeded = Math.ceil(Math.log2(range) / 8);
      const maxValue = Math.pow(256, bytesNeeded);
      const array = new Uint8Array(bytesNeeded);

      window.crypto.getRandomValues(array);
      let randomInt = 0;
      for (let i = 0; i < bytesNeeded; i++) {
        randomInt = (randomInt << 8) + array[i];
      }

      randomValue = min + (randomInt % range);
    } else {
      randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return {
      success: true,
      data: randomValue,
    };
  } catch (error) {
    return {
      success: false,
      error: NumberGenerationError.GENERATION_FAILED,
      message: 'Erro ao gerar número aleatório',
    };
  }
};

/**
 * Gera uma sequência de números para o bingo
 * @param count Quantidade de números a serem gerados (padrão: 75)
 * @returns Resultado da geração com array de números ou erro
 */
export const generateBingoNumbers = (
  count: number = NUMBER_GENERATION_CONFIG.DEFAULT_BINGO_NUMBERS
): NumberGenerationResult<number[]> => {
  try {
    // Validação de entrada
    if (!Number.isInteger(count) || count <= 0) {
      return {
        success: false,
        error: NumberGenerationError.INVALID_COUNT,
        message: 'Quantidade inválida para geração de números',
      };
    }

    const numbers: number[] = Array.from({ length: count }, (_, i) => i + 1);
    return {
      success: true,
      data: numbers,
    };
  } catch (error) {
    return {
      success: false,
      error: NumberGenerationError.GENERATION_FAILED,
      message: 'Erro ao gerar sequência de números',
    };
  }
};

/**
 * Embaralha um array usando o algoritmo Fisher-Yates
 * @param array Array a ser embaralhado
 * @returns Array embaralhado
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  let currentIndex = newArray.length;

  // Aplica o embaralhamento múltiplas vezes para maior aleatoriedade
  for (let iteration = 0; iteration < NUMBER_GENERATION_CONFIG.SHUFFLE_ITERATIONS; iteration++) {
    currentIndex = newArray.length;

    while (currentIndex > 0) {
      // Usando crypto para maior aleatoriedade quando disponível
      let randomIndex: number;
      if (typeof window !== 'undefined' && window.crypto) {
        const array = new Uint8Array(1);
        window.crypto.getRandomValues(array);
        randomIndex = Math.floor((array[0] / 256) * currentIndex);
      } else {
        randomIndex = Math.floor(Math.random() * currentIndex);
      }

      currentIndex--;

      // Troca os elementos
      [newArray[currentIndex], newArray[randomIndex]] = [
        newArray[randomIndex],
        newArray[currentIndex],
      ];
    }
  }

  return newArray;
};

/**
 * Gera uma coluna de cartela de bingo com números válidos
 * @param columnIndex Índice da coluna
 * @param count Quantidade de números a serem gerados
 * @returns Array de números válidos para a coluna
 */
export const generateBingoColumn = (columnIndex: number, count: number = 5): number[] => {
  const min = BINGO_CARD_CONSTRAINTS.columnRanges.min[columnIndex];
  const max = BINGO_CARD_CONSTRAINTS.columnRanges.max[columnIndex];

  const availableNumbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return shuffleArray(availableNumbers).slice(0, count);
};

/**
 * Verifica se um número está no intervalo válido para uma coluna
 * @param number Número a ser verificado
 * @param columnIndex Índice da coluna
 * @returns true se o número é válido para a coluna
 */
export const isNumberValidForColumn = (number: number, columnIndex: number): boolean => {
  const min = BINGO_CARD_CONSTRAINTS.columnRanges.min[columnIndex];
  const max = BINGO_CARD_CONSTRAINTS.columnRanges.max[columnIndex];
  return number >= min && number <= max;
};
