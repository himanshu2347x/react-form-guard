/**
 * Custom React hooks for form handling
 */

import { useCallback, useEffect, useState } from 'react';
import type { FieldConfig, FormState, ValidatorType } from '../lib/types';
import { validateField, validateForm } from '../lib/validators';

/**
 * Hook for managing form state and validation
 */
export function useFormValidator(
  fields: FieldConfig[],
  validationMode: 'onChange' | 'onBlur' | 'onSubmit' = 'onBlur',
  validateOnMount: boolean = false
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
        ? field.validators
        : [{ type: field.validators[0] as ValidatorType }];

      for (const rule of validators) {
        const { isValid, message } = await validateField(value, rule, formState.values);
        if (!isValid) {
          return message;
        }
      }

      return '';
    },
    [fields, formState.values]
  );

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
        const error = await validateSingleField(fieldName, value);
        setFormState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [fieldName]: error,
          },
        }));
      }
    },
    [validationMode, validateSingleField]
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

      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          [fieldName]: error,
        },
      }));
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

    const errors = await validateForm(formState.values, fields);
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

  // Validate on mount if requested
  useEffect(() => {
    if (validateOnMount) {
      void validateFormFields();
    }
  }, [validateOnMount, validateFormFields]);

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
  currentValues: Record<string, unknown>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) {
        e.preventDefault();
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const isValid = await validateForm();

        if (!isValid) {
          setSubmitError('Please fix the errors in the form');
          setIsSubmitting(false);
          return;
        }

        await onSubmit(currentValues);
        setIsSubmitting(false);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred during submission';
        setSubmitError(message);
        setIsSubmitting(false);
      }
    },
    [onSubmit, validateForm, currentValues]
  );

  return {
    handleSubmit,
    isSubmitting,
    submitError,
    setSubmitError,
  };
}
