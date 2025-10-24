/**
 * Core types and interfaces for React Form Guard
 */

/** Allowed validator types */
export type ValidatorType =
  | 'required'
  | 'email'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'match'
  | 'custom'
  | 'number'
  | 'url'
  | 'phone';

/** Allowed input types */
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'datetime-local'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio';

/**
 * Validation rule configuration
 */
export interface ValidationRule {
  type: ValidatorType | string; // allow any string
  message?: string;
  value?: string | number | boolean | RegExp;
  matchField?: string;
  custom?: (value: unknown, formData?: Record<string, unknown>) => boolean | Promise<boolean>;
}

/**
 * Field configuration
 * Flexible typing: type is string, validators can be array of objects or strings
 */
export interface FieldConfig {
  name: string;
  type?: string; // allow any string
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validators?: Array<ValidationRule | string>;
  defaultValue?: unknown;
  options?: Array<{ value: string | number; label: string }>;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp | string;
  rows?: number; // for textarea
  className?: string;
}

/** Form field error details */
export interface FieldError {
  fieldName: string;
  message: string;
  type: ValidatorType | string;
  timestamp: number;
}

/** Form validation state */
export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValidating: boolean;
  isValid: boolean;
}

/** Form configuration */
export interface FormConfig {
  fields: FieldConfig[];
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  onError?: (errors: Record<string, string>) => void;
  onValuesChange?: (values: Record<string, unknown>) => void;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  validateOnMount?: boolean;
}

/** Validation result */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  errorCount: number;
}

/** Custom validator function */
export type CustomValidator = (
  value: unknown,
  rule?: ValidationRule,
  formData?: Record<string, unknown>
) => boolean | Promise<boolean>;

/** Component customization options */
export interface CustomizationOptions {
  inputClass?: string;
  errorClass?: string;
  buttonClass?: string;
  containerClass?: string;
  labelClass?: string;
  formClass?: string;
  successClass?: string;
  warningClass?: string;
  fieldWrapperClass?: string;
  animationDuration?: number; // in ms
  showAnimations?: boolean;
  theme?: 'light' | 'dark' | 'custom';
}

/** Form submission handler */
export interface FormSubmitHandler {
  (values: Record<string, unknown>): void | Promise<void>;
}

/** Field change handler */
export interface FieldChangeHandler {
  (name: string, value: unknown): void;
}

/** Field blur handler */
export interface FieldBlurHandler {
  (name: string): void;
}