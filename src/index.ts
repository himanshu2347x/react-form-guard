/**
 * React Form Guard - A reusable, customizable Form Validator Widget
 * Main entry point for the package
 */

// Components
export { DynamicForm } from './components/DynamicForm';
export { FormField } from './components/FormField';

// Hooks
export { useFormSubmission, useFormValidator } from './hooks/useFormValidator';

// Types
export type {
    CustomizationOptions, CustomValidator, FieldBlurHandler, FieldChangeHandler, FieldConfig,
    FieldError, FormConfig, FormState, FormSubmitHandler, InputType, ValidationResult, ValidationRule, ValidatorType
} from './lib/types';

// Utilities
export { isEmpty, sanitizeValues, validateField, validateForm } from './lib/validators';

// Styles (import in your app)
// import 'formguardian-react/styles/form.module.css'
