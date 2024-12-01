// src/utils/validation.ts

/**
 * Constantes para validação
 */
export const VALIDATION_CONSTRAINTS = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  BINGO: {
    MIN_NUMBER: 1,
    MAX_NUMBER: 75,
    CARD_SIZE: 25,
  },
  EMAIL: {
    // RFC 5322 Official Standard
    PATTERN:
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    MAX_LENGTH: 254, // RFC 5321
  },
} as const;

/**
 * Interface para resultados de validação
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

/**
 * Valida um endereço de e-mail
 * @param email Email a ser validado
 * @returns Resultado da validação com possíveis erros
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email é obrigatório');
    return createValidationResult(errors);
  }

  if (email.length > VALIDATION_CONSTRAINTS.EMAIL.MAX_LENGTH) {
    errors.push(
      `Email não pode ter mais que ${VALIDATION_CONSTRAINTS.EMAIL.MAX_LENGTH} caracteres`
    );
  }

  if (!VALIDATION_CONSTRAINTS.EMAIL.PATTERN.test(email)) {
    errors.push('Email inválido');
  }

  return createValidationResult(errors);
};

/**
 * Valida um nome de usuário
 * @param username Nome de usuário a ser validado
 * @returns Resultado da validação com possíveis erros
 */
export const validateUsername = (username: string): ValidationResult => {
  const errors: string[] = [];

  if (!username) {
    errors.push('Nome de usuário é obrigatório');
    return createValidationResult(errors);
  }

  const { MIN_LENGTH, MAX_LENGTH, PATTERN } = VALIDATION_CONSTRAINTS.USERNAME;

  if (username.length < MIN_LENGTH || username.length > MAX_LENGTH) {
    errors.push(`Nome de usuário deve ter entre ${MIN_LENGTH} e ${MAX_LENGTH} caracteres`);
  }

  if (!PATTERN.test(username)) {
    errors.push('Nome de usuário deve conter apenas letras, números, underline e hífen');
  }

  return createValidationResult(errors);
};

/**
 * Valida um número do bingo
 * @param number Número a ser validado
 * @returns Resultado da validação com possíveis erros
 */
export const validateBingoNumber = (number: number): ValidationResult => {
  const errors: string[] = [];

  if (typeof number !== 'number' || isNaN(number)) {
    errors.push('Valor deve ser um número válido');
    return createValidationResult(errors);
  }

  const { MIN_NUMBER, MAX_NUMBER } = VALIDATION_CONSTRAINTS.BINGO;

  if (number < MIN_NUMBER || number > MAX_NUMBER) {
    errors.push(`Número deve estar entre ${MIN_NUMBER} e ${MAX_NUMBER}`);
  }

  return createValidationResult(errors);
};

/**
 * Valida uma cartela de bingo completa
 * @param numbers Array de números da cartela
 * @returns Resultado da validação com possíveis erros
 */
export const validateBingoCard = (numbers: number[]): ValidationResult => {
  const errors: string[] = [];

  if (!Array.isArray(numbers)) {
    errors.push('Cartela inválida');
    return createValidationResult(errors);
  }

  if (numbers.length !== VALIDATION_CONSTRAINTS.BINGO.CARD_SIZE) {
    errors.push(`Cartela deve conter exatamente ${VALIDATION_CONSTRAINTS.BINGO.CARD_SIZE} números`);
  }

  // Verifica números duplicados
  const uniqueNumbers = new Set(numbers);
  if (uniqueNumbers.size !== numbers.length) {
    errors.push('Cartela não pode conter números duplicados');
  }

  // Valida cada número individualmente
  numbers.forEach((number) => {
    const numberValidation = validateBingoNumber(number);
    if (!numberValidation.isValid) {
      errors.push(...(numberValidation.errors || []));
    }
  });

  return createValidationResult(errors);
};

/**
 * Verifica se um email é válido (versão simplificada para compatibilidade)
 * @deprecated Use validateEmail() para validação completa
 */
export const isValidEmail = (email: string): boolean => {
  return validateEmail(email).isValid;
};

/**
 * Verifica se um nome de usuário é válido (versão simplificada para compatibilidade)
 * @deprecated Use validateUsername() para validação completa
 */
export const isValidUsername = (username: string): boolean => {
  return validateUsername(username).isValid;
};

/**
 * Verifica se um número de bingo é válido (versão simplificada para compatibilidade)
 * @deprecated Use validateBingoNumber() para validação completa
 */
export const isValidBingoNumber = (number: number): boolean => {
  return validateBingoNumber(number).isValid;
};

/**
 * Cria um objeto de resultado de validação
 * @private
 */
const createValidationResult = (errors: string[]): ValidationResult => ({
  isValid: errors.length === 0,
  errors: errors.length > 0 ? errors : undefined,
});
