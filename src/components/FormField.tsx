import React, { useCallback } from 'react';
import type { FieldBlurHandler, FieldChangeHandler, FieldConfig } from '../lib/types';
// Use plain CSS class names (styles provided via `src/styles/index.css`).

interface FormFieldProps {
  field: FieldConfig;
  value: unknown;
  error: string;
  touched: boolean;
  onChange: FieldChangeHandler;
  onBlur: FieldBlurHandler;
  disabled?: boolean;
  showAnimation?: boolean;
}

/**
 * FormField component - Renders individual form fields with validation and animations
 */
export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  disabled = false,
  showAnimation = true,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const newValue = e.target.type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : e.target.value;
      onChange(field.name, newValue);
    },
    [field.name, onChange]
  );

  const handleBlur = useCallback(() => {
    onBlur(field.name);
  }, [field.name, onBlur]);

  const handleFocus = useCallback(() => {
    // Used for focus state tracking if needed in future
  }, []);  const isError = touched && error;
  const fieldClassName = [
    'form-group',
    isError && showAnimation && 'has-error',
  ]
    .filter(Boolean)
    .join(' ');

  const inputClassName = [
    'form-input',
    isError && 'error',
    !isError && value && 'success',
  ]
    .filter(Boolean)
    .join(' ');

  // Render based on field type
  switch (field.type) {
    case 'textarea':
      return (
        <div className={fieldClassName}>
          {field.label && (
            <label className={`form-label ${isError ? 'error' : ''}`}>
              {field.label}
              {field.required && <span className="required-indicator">*</span>}
            </label>
          )}
          <textarea
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={String(value ?? '')}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled || field.disabled}
            rows={field.rows || 4}
            className={`${inputClassName} form-textarea`}
            aria-invalid={!!isError}
            aria-describedby={isError ? `${field.name}-error` : undefined}
          />
          {isError && (
            <div id={`${field.name}-error`} className="form-error">
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      );

    case 'select':
      return (
        <div className={fieldClassName}>
          {field.label && (
            <label className={`form-label ${isError ? 'error' : ''}`}>
              {field.label}
              {field.required && <span className="required-indicator">*</span>}
            </label>
          )}
          <select
            id={field.name}
            name={field.name}
            value={String(value ?? '')}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled || field.disabled}
            className={`${inputClassName} form-select`}
            aria-invalid={!!isError}
            aria-describedby={isError ? `${field.name}-error` : undefined}
          >
            <option value="">Select {field.label || field.name}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {isError && (
            <div id={`${field.name}-error`} className="form-error">
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      );

    case 'checkbox':
      return (
        <div className={fieldClassName}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              id={field.name}
              name={field.name}
              type="checkbox"
              checked={Boolean(value)}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              disabled={disabled || field.disabled}
              className="form-checkbox"
              aria-invalid={!!isError}
            />
            <span className="form-label" style={{ margin: 0 }}>
              {field.label || field.placeholder}
            </span>
          </label>
          {isError && (
            <div id={`${field.name}-error`} className="form-error">
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      );

    case 'radio':
      return (
        <div className={fieldClassName}>
          {field.label && (
            <label className="form-label">
              {field.label}
              {field.required && <span className="required-indicator">*</span>}
            </label>
          )}
          <fieldset>
            {field.options?.map((opt) => (
              <label key={opt.value} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input
                  name={field.name}
                  type="radio"
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={disabled || field.disabled}
                    className="form-radio"
                />
                <span style={{ marginLeft: '0.5rem' }}>{opt.label}</span>
              </label>
            ))}
          </fieldset>
          {isError && (
            <div id={`${field.name}-error`} className="form-error">
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className={fieldClassName}>
          {field.label && (
            <label className={`form-label ${isError ? 'error' : ''}`}>
              {field.label}
              {field.required && <span className="required-indicator">*</span>}
            </label>
          )}
          <input
            id={field.name}
            name={field.name}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            value={String(value ?? '')}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled || field.disabled}
            minLength={field.minLength}
            maxLength={field.maxLength}
            pattern={typeof field.pattern === 'string' ? field.pattern : undefined}
            className={inputClassName}
            aria-invalid={!!isError}
            aria-describedby={isError ? `${field.name}-error` : undefined}
          />
          {isError && (
            <div id={`${field.name}-error`} className="form-error">
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      );
  }
};

export default FormField;
