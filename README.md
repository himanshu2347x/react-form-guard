# FormGuardian React

A powerful, reusable, and customizable Form Validator Widget for React with comprehensive validation, error handling, micro-animations, and TypeScript support. Built for easy integration into React applications.

[![npm version](https://img.shields.io/npm/v/formguardian-react.svg)](https://www.npmjs.com/package/formguardian-react)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Features

✨ **Comprehensive Validation**
- Built-in validators: required, email, minLength, maxLength, pattern, match, custom, number, url, phone
- Easy to extend with custom validators
- Real-time and on-blur validation modes

🎨 **Micro-Animations**
- Smooth field animations (slide, shake, scale, focus pulse)
- Loading states with spinner animation
- Error/success transitions
- Fully customizable animation timing

🛡️ **Type-Safe**
- Full TypeScript support
- Comprehensive type definitions
- IntelliSense support in IDEs

🎯 **Flexible Field Types**
- Text, email, password, number, tel, url, date, datetime-local
- Textarea with custom rows
- Select dropdowns
- Checkboxes and radio buttons
- Easy to add custom field types

🎨 **Customizable Styling**
- CSS modules included
- Support for custom CSS classes
- CSS-in-JS compatible
- Responsive design out of the box
- Dark mode ready

🚀 **Developer Experience**
- Easy to import and use
- Hooks-based API
- Zero external dependencies (except React)
- Excellent error messages
- Complete documentation

## Installation

```bash
npm install formguardian-react
# or
yarn add formguardian-react
# or
pnpm add formguardian-react
```

## Quick Start

```jsx
import { DynamicForm } from 'formguardian-react';
import 'formguardian-react/dist/formguardian-react.css'; // Import default styles

const fields = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com',
    required: true,
    validators: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email' }
    ]
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    validators: [
      { type: 'required' },
      { type: 'minLength', value: 6, message: 'Min 6 characters' }
    ]
  }
];

function MyForm() {
  const handleSubmit = async (values) => {
    console.log('Form data:', values);
    // Send to API
  };

  return (
    <DynamicForm
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Sign Up"
    />
  );
}
```

## Usage Examples

### Basic Form

```jsx
import { DynamicForm } from 'react-form-guard';

const fields = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'John Doe',
    required: true,
    validators: ['required']
  }
];

export function BasicForm() {
  return (
    <DynamicForm
      fields={fields}
      onSubmit={(values) => console.log(values)}
    />
  );
}
```

### Advanced Form with Validation

```jsx
import { DynamicForm } from 'react-form-guard';

const registrationFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validators: [
      'required',
      { type: 'email', message: 'Invalid email format' }
    ]
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    validators: [
      { type: 'required', message: 'Password is required' },
      { type: 'minLength', value: 8 },
      { type: 'pattern', value: /^(?=.*[A-Z])/, message: 'Must contain uppercase' }
    ]
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    required: true,
    validators: [
      { type: 'match', matchField: 'password', message: 'Passwords do not match' }
    ]
  }
];

export function RegistrationForm() {
  const handleSubmit = async (values) => {
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(values)
    });
    return response.json();
  };

  return (
    <DynamicForm
      fields={registrationFields}
      onSubmit={handleSubmit}
      validationMode="onChange"
      submitButtonText="Create Account"
      showResetButton
    />
  );
}
```

### Using Custom Hooks

```jsx
import { useFormValidator } from 'react-form-guard';

function CustomForm() {
  const fields = [
    { name: 'username', validators: ['required'] },
    { name: 'email', validators: ['required', 'email'] }
  ];

  const {
    formState,
    setFieldValue,
    setFieldTouched,
    validateFormFields,
    resetForm
  } = useFormValidator(fields, 'onBlur');

  return (
    <>
      <input
        value={formState.values.username}
        onChange={(e) => setFieldValue('username', e.target.value)}
        onBlur={() => setFieldTouched('username')}
      />
      {formState.errors.username && (
        <span>{formState.errors.username}</span>
      )}
    </>
  );
}
```

## API Documentation

### Field Configuration

```typescript
interface FieldConfig {
  name: string;                           // Unique field identifier
  type?: InputType;                       // Input type (default: 'text')
  label?: string;                         // Field label
  placeholder?: string;                   // Placeholder text
  required?: boolean;                     // Is field required
  disabled?: boolean;                     // Is field disabled
  validators?: ValidationRule[];          // Validation rules
  defaultValue?: unknown;                 // Initial value
  options?: Array<{ value, label }>;     // For select/radio/checkbox
  minLength?: number;                     // Min character length
  maxLength?: number;                     // Max character length
  pattern?: RegExp | string;              // Regex pattern
  rows?: number;                          // For textarea
  className?: string;                     // Custom CSS class
}
```

### Supported Input Types

- `text` - Standard text input (default)
- `email` - Email input
- `password` - Password input (masked)
- `number` - Number input
- `tel` - Telephone input
- `url` - URL input
- `date` - Date picker
- `datetime-local` - Date and time picker
- `textarea` - Multi-line text area
- `select` - Dropdown select
- `checkbox` - Checkbox input
- `radio` - Radio button group

### Built-in Validators

```typescript
// String validation
{ type: 'required', message?: string }
{ type: 'email', message?: string }
{ type: 'minLength', value: 5, message?: string }
{ type: 'maxLength', value: 50, message?: string }
{ type: 'pattern', value: /regex/, message?: string }

// Field comparison
{ type: 'match', matchField: 'fieldName', message?: string }

// Type validation
{ type: 'number', message?: string }
{ type: 'url', message?: string }
{ type: 'phone', message?: string }

// Custom validation
{
  type: 'custom',
  custom: (value, formData) => value.length > 3,
  message?: string
}
```

### DynamicForm Component Props

```typescript
interface DynamicFormProps {
  fields: FieldConfig[];                              // Form fields
  onSubmit: (values) => void | Promise<void>;        // Submit handler
  onError?: (errors) => void;                         // Error callback
  onValuesChange?: (values) => void;                  // Values change callback
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit'; // Validation timing
  validateOnMount?: boolean;                          // Validate on mount
  customization?: CustomizationOptions;               // Custom styling/animations
  submitButtonText?: string;                          // Submit button text
  resetButtonText?: string;                           // Reset button text
  showResetButton?: boolean;                          // Show reset button
  disabled?: boolean;                                 // Disable entire form
  className?: string;                                 // Container CSS class
}
```

### Hooks API

#### useFormValidator

```typescript
const {
  formState,           // Current form state (values, errors, touched, isValid)
  setFieldValue,       // Update a field value
  setFieldTouched,     // Mark a field as touched
  validateFormFields,  // Validate entire form
  validateSingleField, // Validate a single field
  resetForm,           // Reset form to initial state
  setFieldValues       // Set multiple field values at once
} = useFormValidator(fields, 'onBlur', false);
```

#### useFormSubmission

```typescript
const {
  handleSubmit,  // Form submit handler
  isSubmitting,  // Is form currently being submitted
  submitError,   // Error message from submission
  setSubmitError // Manually set error message
} = useFormSubmission(onSubmit, validateForm, values);
```

### Utility Functions

#### validateField

```typescript
import { validateField } from 'react-form-guard';

const result = await validateField(
  'user@example.com',
  { type: 'email' }
);
// { isValid: true, message: '' }
```

#### validateForm

```typescript
import { validateForm } from 'react-form-guard';

const errors = await validateForm(formValues, fields);
// { password: 'Password must be at least 6 characters' }
```

#### isEmpty

```typescript
import { isEmpty } from 'react-form-guard';

isEmpty('');      // true
isEmpty([]);      // true
isEmpty(null);    // true
isEmpty('hello'); // false
```

#### sanitizeValues

```typescript
import { sanitizeValues } from 'react-form-guard';

const clean = sanitizeValues(formValues, fields);
// Trims strings, removes empty values
```

## Customization

### Custom Styling

```jsx
<DynamicForm
  fields={fields}
  onSubmit={handleSubmit}
  customization={{
    inputClass: 'my-input-class',
    errorClass: 'my-error-class',
    buttonClass: 'my-button-class',
    containerClass: 'my-container-class',
    labelClass: 'my-label-class',
    showAnimations: true,
    animationDuration: 300,
    theme: 'dark'
  }}
/>
```

### CSS Override

```css
/* Override default styles */
.form-input {
  border-color: #your-color;
  padding: 12px;
}

.form-error {
  color: #your-error-color;
  font-size: 14px;
}

.form-button {
  background-color: #your-primary-color;
}
```

## Example Forms

### Login Form

```jsx
const loginFields = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com',
    required: true,
    validators: ['required', 'email']
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    validators: ['required', { type: 'minLength', value: 6 }]
  }
];

<DynamicForm
  fields={loginFields}
  onSubmit={(values) => fetch('/api/login', { method: 'POST', body: JSON.stringify(values) })}
  submitButtonText="Sign In"
/>
```

### Contact Form

```jsx
const contactFields = [
  { name: 'name', label: 'Name', required: true, validators: ['required'] },
  { name: 'email', label: 'Email', type: 'email', required: true, validators: ['required', 'email'] },
  { name: 'phone', label: 'Phone', type: 'tel', validators: ['phone'] },
  { name: 'message', label: 'Message', type: 'textarea', rows: 5, required: true, validators: ['required'] },
  { name: 'subscribe', label: 'Subscribe to updates', type: 'checkbox' }
];

<DynamicForm
  fields={contactFields}
  onSubmit={(values) => console.log('Message:', values)}
  submitButtonText="Send Message"
  showResetButton
/>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized re-renders with React.memo
- Memoized callbacks using useCallback
- Efficient validation with early exits
- Small bundle size (~15KB gzipped)

## License

MIT License - see LICENSE file for details

## Support & Contributing

For issues, questions, or contributions, please visit [GitHub](https://github.com/yourusername/react-form-guard)

## Changelog

### v1.0.0
- Initial release
- Core validation system with 10+ validators
- React components (DynamicForm, FormField)
- Custom hooks (useFormValidator, useFormSubmission)
- Micro-animations
- Full TypeScript support
- Comprehensive documentation

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
