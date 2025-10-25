/**
 * Custom React hooks for form handling
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce, throttle } from '../lib/debounceThrottle';
import type { FieldConfig, FormState, ValidationRule, ValidatorType } from '../lib/types';
import { validateField, validateForm } from '../lib/validators';

/**
 * Hook for managing form state and validation
 */
export function useFormValidator(
  fields: FieldConfig[],
  validationMode: 'onChange' | 'onBlur' | 'onSubmit' = 'onBlur',
  inputDebounceMs: number = 300
) {
  const [formState, setFormState] = useState<FormState>(() => {
    const initialValues: Record<string, unknown> = {};
    const touched: Record<string, boolean> = {};

    fields.forEach((field) => {
      initialValues[field.name] = field.defaultValue ?? '';
      touched[field.name] = false;
    });

    return {
      values: initialValues,
      errors: {},
      touched,
      isValidating: false,
      isValid: true,
    };
  });

  /**
   * Validate a single field
   */
  const validateSingleField = useCallback(
    async (fieldName: string, value: unknown) => {
      const field = fields.find((f) => f.name === fieldName);
      if (!field || !field.validators) {
        return '';
      }

      const validators = Array.isArray(field.validators)
        ? field.validators.map(v => typeof v === 'string' ? { type: v as ValidatorType } : v)
        : [{ type: field.validators[0] as ValidatorType }];

      // Merge latest typed value into form data snapshot to avoid stale validations on onChange
      const currentFormData = { ...formState.values, [fieldName]: value };
      for (const rule of validators) {
        const { isValid, message } = await validateField(value, rule as ValidationRule, currentFormData);
        if (!isValid) {
          return message;
        }
      }

      return '';
    },
    [fields, formState.values]
  );

  // Debounced validator holder
  const debouncedValidateRef = useRef<((fieldName: string, value: unknown) => void) | null>(null);
  useEffect(() => {
    debouncedValidateRef.current = debounce(async (fname: string, fvalue: unknown) => {
      const error = await validateSingleField(fname, fvalue);
      setFormState((prev) => {
        const updatedErrors = { ...prev.errors, [fname]: error } as Record<string, string>;
        const isValid = Object.values(updatedErrors).every((e) => !e);
        const nextTouched = { ...prev.touched } as Record<string, boolean>;
        const currentVal = prev.values[fname];
        // Only mark as touched after debounce if there's an actual value and an error
        if (
          error && (
            (typeof currentVal === 'string' && currentVal.trim().length > 0) ||
            (typeof currentVal !== 'string' && currentVal !== undefined && currentVal !== null)
          )
        ) {
          nextTouched[fname] = true;
        }

        return {
          ...prev,
          errors: updatedErrors,
          touched: nextTouched,
          isValid,
        };
      });
    }, inputDebounceMs);
  }, [validateSingleField, inputDebounceMs]);

  /**
   * Update field value
   */
  const setFieldValue = useCallback(
    async (fieldName: string, value: unknown) => {
      setFormState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          [fieldName]: value,
        },
      }));

      // Validate based on validation mode
      if (validationMode === 'onChange') {
        // Debounced validation
        debouncedValidateRef.current?.(fieldName, value);
      }
    },
    [validationMode]
  );

  /**
   * Handle field blur
   */
  const setFieldTouched = useCallback(async (fieldName: string) => {
    setFormState((prev) => ({
      ...prev,
      touched: {
        ...prev.touched,
        [fieldName]: true,
      },
    }));

    if (validationMode === 'onBlur') {
      const value = formState.values[fieldName];
      const error = await validateSingleField(fieldName, value);

      setFormState((prev) => {
        const updatedErrors = { ...prev.errors, [fieldName]: error } as Record<string, string>;
        const isValid = Object.values(updatedErrors).every((e) => !e);
        return {
          ...prev,
          errors: updatedErrors,
          isValid,
        };
      });
    }
  }, [validationMode, formState.values, validateSingleField]);

  /**
   * Validate entire form
   */
  const validateFormFields = useCallback(async () => {
    setFormState((prev) => ({
      ...prev,
      isValidating: true,
    }));

    const transformedFields = fields.map(field => ({
      name: field.name,
      validators: field.validators?.map(v => 
        typeof v === 'string' ? { type: v as ValidatorType } : v
      )
    }));
    const errors = await validateForm(formState.values, transformedFields);
    const isValid = Object.keys(errors).length === 0;

    setFormState((prev) => ({
      ...prev,
      errors,
      isValid,
      isValidating: false,
    }));

    return isValid;
  }, [fields, formState.values]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    const initialValues: Record<string, unknown> = {};
    const touched: Record<string, boolean> = {};

    fields.forEach((field) => {
      initialValues[field.name] = field.defaultValue ?? '';
      touched[field.name] = false;
    });

    setFormState({
      values: initialValues,
      errors: {},
      touched,
      isValidating: false,
      isValid: true,
    });
  }, [fields]);

  /**
   * Set multiple field values
   */
  const setFieldValues = useCallback(
    (values: Record<string, unknown>) => {
      setFormState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          ...values,
        },
      }));
    },
    []
  );

  // No validation on mount (feature removed)

  return {
    formState,
    setFieldValue,
    setFieldTouched,
    validateFormFields,
    validateSingleField,
    resetForm,
    setFieldValues,
  };
}

/**
 * Hook for managing form submission
 */
export function useFormSubmission(
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>,
  validateForm: () => Promise<boolean>,
  currentValues: Record<string, unknown>,
  submitThrottleMs: number = 1000
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isThrottled, setIsThrottled] = useState(false);

  // Create throttled submit function that always uses latest closures
  const throttledSubmitRef = useRef<((e?: React.FormEvent<HTMLFormElement>) => void) | null>(null);
  useEffect(() => {
    throttledSubmitRef.current = throttle(async (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const isValid = await validateForm();
        if (!isValid) {
          setSubmitError('Please fix the errors in the form');
          setIsSubmitting(false);
          return;
        }

        // Start throttle window only when a valid submission begins
        setIsThrottled(true);
        setTimeout(() => setIsThrottled(false), submitThrottleMs);

        await onSubmit(currentValues);
        setIsSubmitting(false);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred during submission';
        setSubmitError(message);
        setIsSubmitting(false);
      }
    }, submitThrottleMs);
  }, [onSubmit, validateForm, currentValues, submitThrottleMs]);

  const handleSubmit = useCallback((e?: React.FormEvent<HTMLFormElement>) => {
    throttledSubmitRef.current?.(e);
  }, []);

  return {
    handleSubmit,
    isSubmitting,
    isThrottled,
    submitError,
    setSubmitError,
  };
}
