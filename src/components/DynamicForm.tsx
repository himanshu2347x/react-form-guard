import React, { useEffect } from 'react';
import { useFormSubmission, useFormValidator } from '../hooks/useFormValidator';
import type { CustomizationOptions, FieldConfig } from '../lib/types';
// Styles are provided as a plain CSS entry (`src/styles/index.css`).
// Consumers should import 'formguardian-react/styles' (side-effect) or the package will provide styles in dist.
import FormField from './FormField';

interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  customization?: CustomizationOptions;
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  disabled?: boolean;
  className?: string;
  submitThrottleMs?: number; // throttle delay for submit button
}

/**
 * DynamicForm component - Main form component with validation and field management
 */
export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  validationMode = 'onBlur',
  customization,
  submitButtonText = 'Submit',
  resetButtonText = 'Reset',
  showResetButton = false,
  disabled = false,
  className,
  submitThrottleMs = 1000,
}) => {
  const {
    formState,
    setFieldValue,
    setFieldTouched,
    validateFormFields,
    resetForm,
  } = useFormValidator(fields, validationMode);

  const { handleSubmit, isSubmitting, isThrottled, submitError, setSubmitError } = useFormSubmission(
    onSubmit,
    validateFormFields,
    formState.values,
    submitThrottleMs
  );

  // Auto-clear submit error when all field errors are resolved
  useEffect(() => {
    const hasErrors = Object.values(formState.errors).some(Boolean);
    if (!hasErrors && submitError) {
      setSubmitError(null);
    }
  }, [formState.errors, submitError, setSubmitError]);

  const containerClass = [
    'form-container',
    className,
    customization?.containerClass,
  ]
    .filter(Boolean)
    .join(' ');

  const buttonClass = [
    'form-button',
    'primary',
    customization?.buttonClass,
    isSubmitting && 'loading',
  ]
    .filter(Boolean)
    .join(' ');

  const resetButtonClass = [
    'form-button',
    'secondary',
    customization?.buttonClass,
  ]
    .filter(Boolean)
    .join(' ');

  const formContainerClass = [
    customization?.formClass,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <form onSubmit={handleSubmit} className={formContainerClass}>
      <div className={containerClass}>
        {/* Render all fields */}
        {fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formState.values[field.name]}
            error={formState.errors[field.name] || ''}
            touched={formState.touched[field.name] || false}
            onChange={setFieldValue}
            onBlur={setFieldTouched}
            disabled={disabled || field.disabled}
            showAnimation={customization?.showAnimations !== false}
          />
        ))}

        {/* Submit error message */}
        {submitError && (
          <div className="error-boundary">
            <span>⚠ {submitError}</span>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="submit"
            disabled={disabled || isSubmitting || isThrottled}
            className={buttonClass}
          >
            {isSubmitting ? 'Submitting...' : submitButtonText}
          </button>

          {showResetButton && (
            <button
              type="button"
              onClick={resetForm}
              disabled={disabled || isSubmitting}
              className={resetButtonClass}
            >
              {resetButtonText}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default DynamicForm;
