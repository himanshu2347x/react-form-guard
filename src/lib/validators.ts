/**
 * Validation utilities and built-in validators
 */

import type { ValidationRule, ValidatorType } from './types';

/**
 * Built-in validator functions
 */
const VALIDATORS: Record<ValidatorType, (value: unknown, rule?: ValidationRule) => boolean | Promise<boolean>> = {
  required: (value: unknown) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== undefined && value !== '';
  },

  email: (value: unknown) => {
    if (typeof value !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  minLength: (value: unknown, rule?: ValidationRule) => {
    if (typeof value !== 'string') return false;
    const minLength = (rule?.value as number) ?? (rule as unknown as { minLength: number })?.minLength ?? 0;
    return value.length >= minLength;
  },

  maxLength: (value: unknown, rule?: ValidationRule) => {
    if (typeof value !== 'string') return false;
    const maxLength = (rule?.value as number) ?? (rule as unknown as { maxLength: number })?.maxLength ?? Infinity;
    return value.length <= maxLength;
  },

  pattern: (value: unknown, rule?: ValidationRule) => {
    if (typeof value !== 'string') return false;
    const pattern = rule?.value as RegExp | string | undefined;
    if (!pattern) return true;
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return regex.test(value);
  },

  match: (value: unknown, rule?: ValidationRule) => {
    if (typeof value !== 'string') return false;
    const pattern = rule?.value as RegExp | string | undefined;
    if (!pattern) return true;
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return regex.test(value);
  },

  custom: (value: unknown, rule?: ValidationRule) => {
    if (!rule?.custom) return true;
    return rule.custom(value);
  },

  number: (value: unknown) => {
    return !isNaN(Number(value)) && value !== '';
  },

  url: (value: unknown) => {
    if (typeof value !== 'string') return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  phone: (value: unknown) => {
    if (typeof value !== 'string') return false;
    // Must be exactly 10 digits, no spaces, no symbols, no country code
    return /^\d{10}$/.test(value);
  },
};

/**
 * Default error messages for validators
 */
const DEFAULT_MESSAGES: Record<ValidatorType, string> = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: 'This field must be at least {value} characters',
  maxLength: 'This field must not exceed {value} characters',
  pattern: 'This field format is invalid',
  match: 'This field does not match the required pattern',
  custom: 'This field is invalid',
  number: 'Please enter a valid number',
  url: 'Please enter a valid URL',
  phone: 'Please enter a valid phone number',
};

/**
 * Validate a single value against a rule
 */
export async function validateField(
  value: unknown,
  rule: ValidationRule | ValidatorType,
  formData?: Record<string, unknown>
): Promise<{ isValid: boolean; message: string }> {
  let normalizedRule: ValidationRule;

  // Normalize rule format
  if (typeof rule === 'string') {
    normalizedRule = { type: rule };
  } else {
    normalizedRule = rule;
  }

  // Handle custom validators with form data
  if (normalizedRule.type === 'custom' && normalizedRule.custom) {
    const result = await normalizedRule.custom(value, formData);
    return {
      isValid: result,
      message: normalizedRule.message || DEFAULT_MESSAGES[normalizedRule.type],
    };
  }

  // Handle field matching (for password confirmation)
  if (normalizedRule.type === 'match' && normalizedRule.matchField && formData) {
    const matchValue = formData[normalizedRule.matchField];
    const isValid = value === matchValue;
    return {
      isValid,
      message: normalizedRule.message || `This field must match ${normalizedRule.matchField}`,
    };
  }

  // Type guard to check if the type is a valid ValidatorType
  const isValidType = (type: string): type is ValidatorType => {
    return type in VALIDATORS;
  };

  if (!isValidType(normalizedRule.type)) {
    return { isValid: true, message: '' };
  }

  const validator = VALIDATORS[normalizedRule.type];
  if (!validator) {
    return { isValid: true, message: '' };
  }

  const isValid = await validator(value, normalizedRule);
  let message = normalizedRule.message || DEFAULT_MESSAGES[normalizedRule.type];

  // Replace placeholders in message
  if (normalizedRule.value !== undefined) {
    message = message.replace('{value}', String(normalizedRule.value));
  }

  return { isValid, message };
}

/**
 * Validate all fields in a form
 */
export async function validateForm(
  values: Record<string, unknown>,
  fields: Array<{ name: string; validators?: (ValidationRule | ValidatorType)[] }>
): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};

  await Promise.all(
    fields.map(async (field) => {
      if (!field.validators || field.validators.length === 0) {
        return;
      }

      for (const rule of field.validators) {
        const { isValid, message } = await validateField(values[field.name], rule, values);
        if (!isValid) {
          errors[field.name] = message;
          break; // Stop at first error
        }
      }
    })
  );

  return errors;
}

/**
 * Check if a value is empty
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Sanitize form values
 */
export function sanitizeValues(
  values: Record<string, unknown>,
  fields: Array<{ name: string; type?: string }>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  Object.entries(values).forEach(([key, value]) => {
    const field = fields.find((f) => f.name === key);

    // Remove empty strings for optional fields
    if (value === '' && field?.type !== 'password') {
      sanitized[key] = undefined;
      return;
    }

    // Trim strings
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
      return;
    }

    sanitized[key] = value;
  });

  return sanitized;
}
