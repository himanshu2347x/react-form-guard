# React Form Guard - Quick Reference

## Installation

```bash
npm install react-form-guard
```

## Basic Import

```tsx
import { DynamicForm } from 'react-form-guard';
import type { FieldConfig } from 'react-form-guard';
```

## Minimal Example

```tsx
const fields: FieldConfig[] = [
  { name: 'email', type: 'email', required: true, validators: ['required', 'email'] }
];

<DynamicForm
  fields={fields}
  onSubmit={(values) => console.log(values)}
  submitButtonText="Submit"
/>
```

## All Validators

```tsx
const validators = [
  'required',                           // Must have value
  'email',                              // Valid email
  { type: 'minLength', value: 5 },      // Min 5 chars
  { type: 'maxLength', value: 50 },     // Max 50 chars
  { type: 'pattern', value: /regex/ },  // Regex match
  { type: 'match', matchField: 'pwd' }, // Field match
  { type: 'number' },                   // Is number
  { type: 'url' },                      // Valid URL
  { type: 'phone' },                    // Valid phone
  {                                     // Custom
    type: 'custom',
    custom: (val) => val.length > 3,
    message: 'Too short'
  }
];
```

## All Field Types

```tsx
const fields: FieldConfig[] = [
  { name: 'text', type: 'text' },              // Text input
  { name: 'email', type: 'email' },            // Email input
  { name: 'password', type: 'password' },      // Password
  { name: 'number', type: 'number' },          // Number
  { name: 'tel', type: 'tel' },                // Telephone
  { name: 'url', type: 'url' },                // URL
  { name: 'date', type: 'date' },              // Date picker
  { name: 'datetime', type: 'datetime-local' },// Date + time
  { name: 'message', type: 'textarea', rows: 5 }, // Multi-line
  {                                            // Dropdown
    name: 'country',
    type: 'select',
    options: [
      { value: 'us', label: 'USA' },
      { value: 'uk', label: 'UK' }
    ]
  },
  { name: 'agree', type: 'checkbox' },        // Checkbox
  {                                            // Radio
    name: 'role',
    type: 'radio',
    options: [
      { value: 'user', label: 'User' },
      { value: 'admin', label: 'Admin' }
    ]
  }
];
```

## DynamicForm Props

```tsx
interface DynamicFormProps {
  fields: FieldConfig[];                              // Required: Form fields
  onSubmit: (values: Record<string, unknown>) => void; // Required: Submit handler
  onError?: (errors: Record<string, string>) => void; // Optional: Error callback
  onValuesChange?: (values: Record<string, unknown>) => void; // Optional
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit'; // Default: 'onBlur'
  validateOnMount?: boolean;                          // Default: false
  submitButtonText?: string;                          // Default: 'Submit'
  resetButtonText?: string;                           // Default: 'Reset'
  showResetButton?: boolean;                          // Default: false
  disabled?: boolean;                                 // Default: false
  className?: string;                                 // Container class
  customization?: CustomizationOptions;               // Styling options
}
```

## Customization

```tsx
<DynamicForm
  fields={fields}
  onSubmit={handleSubmit}
  customization={{
    inputClass: 'my-input',
    errorClass: 'my-error',
    buttonClass: 'my-button',
    containerClass: 'my-container',
    labelClass: 'my-label',
    formClass: 'my-form',
    showAnimations: true,
    animationDuration: 300,
    theme: 'light'
  }}
/>
```

## Using Hooks

```tsx
import { useFormValidator } from 'react-form-guard';

const {
  formState,             // { values, errors, touched, isValid, isValidating }
  setFieldValue,         // (name, value) => void
  setFieldTouched,       // (name) => void
  validateFormFields,    // () => Promise<boolean>
  validateSingleField,   // (name, value) => Promise<string>
  resetForm,             // () => void
  setFieldValues         // (values) => void
} = useFormValidator(fields, 'onBlur', false);
```

## Custom Validators

```tsx
// Sync
{
  type: 'custom',
  custom: (value) => value.length > 3,
  message: 'Min 3 characters'
}

// Async
{
  type: 'custom',
  custom: async (value) => {
    const res = await fetch(`/api/check/${value}`);
    return res.ok;
  },
  message: 'Already taken'
}

// With form data
{
  type: 'custom',
  custom: (value, formData) => {
    return formData.country === 'US' ? value.length === 5 : true;
  }
}
```

## Form Config Example

```tsx
const fields: FieldConfig[] = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'John',
    required: true,
    disabled: false,
    defaultValue: '',
    minLength: 2,
    maxLength: 50,
    className: 'my-field',
    validators: [
      { type: 'required', message: 'Required' },
      { type: 'minLength', value: 2 }
    ]
  }
];

<DynamicForm
  fields={fields}
  onSubmit={async (values) => {
    console.log('Submitted:', values);
    // Call API
    await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(values)
    });
  }}
  onError={(errors) => console.log('Errors:', errors)}
  onValuesChange={(values) => console.log('Changed:', values)}
  validationMode="onBlur"
  validateOnMount={false}
  submitButtonText="Create Account"
  resetButtonText="Clear"
  showResetButton={true}
  customization={{
    showAnimations: true,
    animationDuration: 300
  }}
/>
```

## Common Patterns

### Password Confirmation
```tsx
{
  name: 'confirmPassword',
  type: 'password',
  validators: [
    { type: 'match', matchField: 'password' }
  ]
}
```

### Email Validation
```tsx
{
  name: 'email',
  type: 'email',
  validators: [
    { type: 'required' },
    { type: 'email' }
  ]
}
```

### Phone Validation
```tsx
{
  name: 'phone',
  type: 'tel',
  validators: [
    { type: 'phone' }
  ]
}
```

### Date Range
```tsx
{
  name: 'startDate',
  type: 'date',
  validators: [
    {
      type: 'custom',
      custom: (value, formData) => {
        const start = new Date(value as string);
        const end = new Date(formData.endDate as string);
        return start < end;
      },
      message: 'Start date must be before end date'
    }
  ]
}
```

### Conditional Validation
```tsx
{
  name: 'state',
  type: 'text',
  validators: [
    {
      type: 'custom',
      custom: (value, formData) => {
        if (formData.country === 'US') {
          return value.length === 2;
        }
        return true;
      }
    }
  ]
}
```

## Validation Modes

```tsx
// On every keystroke (real-time)
validationMode="onChange"

// When user leaves field (default)
validationMode="onBlur"

// Only when form is submitted
validationMode="onSubmit"
```

## Form State

```tsx
formState = {
  values: {
    email: 'user@example.com',
    password: '123456'
  },
  errors: {
    // email: 'Invalid email' (only if error)
  },
  touched: {
    email: true,
    password: false
  },
  isValid: true,
  isValidating: false
}
```

## Utility Functions

```tsx
import {
  validateField,
  validateForm,
  isEmpty,
  sanitizeValues
} from 'react-form-guard';

// Validate single field
const result = await validateField('user@example.com', { type: 'email' });
// { isValid: true, message: '' }

// Validate entire form
const errors = await validateForm(values, fields);
// { password: 'Too short' }

// Check if empty
isEmpty('');        // true
isEmpty(null);      // true
isEmpty([]);        // true

// Clean values
const clean = sanitizeValues(values, fields);
```

## Imports by Use Case

```tsx
// Component usage
import { DynamicForm } from 'react-form-guard';

// With TypeScript
import { DynamicForm } from 'react-form-guard';
import type { FieldConfig, FormState } from 'react-form-guard';

// Custom hooks
import { useFormValidator, useFormSubmission } from 'react-form-guard';

// Individual components
import { FormField } from 'react-form-guard';

// Utilities
import { validateField, validateForm, isEmpty } from 'react-form-guard';

// Styles
import 'react-form-guard/styles';
```

## CSS Classes

```css
.form-container          /* Form wrapper */
.form-group             /* Individual field wrapper */
.form-group.has-error   /* Field with error */
.form-label             /* Field label */
.required-indicator     /* Required asterisk */
.form-input             /* Input/textarea/select */
.form-input.error       /* Input with error */
.form-input.success     /* Valid input */
.form-checkbox          /* Checkbox input */
.form-radio             /* Radio input */
.form-error             /* Error message */
.form-button            /* Submit/Reset button */
.form-button.primary    /* Primary button */
.form-button.secondary  /* Secondary button */
.form-button.loading    /* Loading state */
.error-boundary         /* Error container */
```

## CSS Variables

```css
--primary-color: #3b82f6
--success-color: #10b981
--error-color: #ef4444
--warning-color: #f59e0b
--text-primary: #1f2937
--text-secondary: #6b7280
--border-color: #e5e7eb
--background-light: #f9fafb
--animation-duration: 300ms
--animation-timing: cubic-bezier(0.4, 0, 0.2, 1)
```

## Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers

## Performance Tips

1. Use `validationMode="onBlur"` for better performance
2. Split large forms into multiple smaller forms
3. Disable animations on slow devices: `showAnimations: false`
4. Memoize heavy custom validators
5. Use `onSubmit` mode for forms with many fields

## Accessibility

- ✅ ARIA labels and descriptions
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus indicators
- ✅ Error announcements
- ✅ High contrast support
- ✅ Semantic HTML

---

**For complete documentation, see [README.md](./README.md)**
