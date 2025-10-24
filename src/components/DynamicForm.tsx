import React, { useEffect } from 'react';
import { useFormSubmission, useFormValidator } from '../hooks/useFormValidator';
import type { CustomizationOptions, FieldConfig } from '../lib/types';
import styles from '../styles/form.module.css';
import FormField from './FormField';

interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  onError?: (errors: Record<string, string>) => void;
  onValuesChange?: (values: Record<string, unknown>) => void;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  validateOnMount?: boolean;
  customization?: CustomizationOptions;
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * DynamicForm component - Main form component with validation and field management
 */
export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  onError,
  onValuesChange,
  validationMode = 'onBlur',
  validateOnMount = false,
  customization,
  submitButtonText = 'Submit',
  resetButtonText = 'Reset',
  showResetButton = false,
  disabled = false,
  className,
}) => {
  const {
    formState,
    setFieldValue,
    setFieldTouched,
    validateFormFields,
    resetForm,
  } = useFormValidator(fields, validationMode, validateOnMount);

  const { handleSubmit, isSubmitting, submitError } = useFormSubmission(
    onSubmit,
    validateFormFields,
    formState.values
  );

  // Notify parent of value changes
  useEffect(() => {
    onValuesChange?.(formState.values);
  }, [formState.values, onValuesChange]);

  // Notify parent of errors
  useEffect(() => {
    onError?.(formState.errors);
  }, [formState.errors, onError]);

  const containerClass = [
    styles['form-container'],
    className,
    customization?.containerClass,
  ]
    .filter(Boolean)
    .join(' ');

  const buttonClass = [
    styles['form-button'],
    styles.primary,
    customization?.buttonClass,
    isSubmitting && styles.loading,
  ]
    .filter(Boolean)
    .join(' ');

  const resetButtonClass = [
    styles['form-button'],
    styles.secondary,
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
          <div className={styles['error-boundary']}>
            <span>⚠ {submitError}</span>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="submit"
            disabled={disabled || isSubmitting || !formState.isValid}
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
