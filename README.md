# FormGuardian React

A powerful yet simple form validator for React applications with built-in validation, animations, and TypeScript support.

[![NPM Version](https://img.shields.io/npm/v/formguardian-react.svg)](https://www.npmjs.com/package/formguardian-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

✨ **Instant Form Creation** - Create forms in minutes, not hours  
🎯 **Built-in Validation** - Email, required, length, pattern, and more  
🎨 **Ready-to-Use Styles** - Beautiful defaults with easy customization  
🔄 **Type-Safe** - Full TypeScript support with great IDE experience  

## Quick Start

```bash
npm install formguardian-react
```

Import and use in your React app:

```tsx
import { DynamicForm } from 'formguardian-react';
import type { FieldConfig } from 'formguardian-react';
import 'formguardian-react/styles';

function LoginForm() {
  // Define your form fields
  const fields: FieldConfig[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      validators: [
        { type: "email", message: "Please enter a valid email" }
      ]
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      validators: [
        { type: "minLength", value: 8, message: "Must be at least 8 characters" }
      ]
    }
  ];

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log('Form values:', values);
  };

  return (
    <DynamicForm
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Sign In"
    />
  );
}
```

## Key Concepts

###  Field Configuration
Each field in the `fields` array describes how to render and validate a form input:

```tsx
const fields: FieldConfig[] = [
  {
    name: "email",           // REQUIRED - Unique field identifier
    type: "email",           // Optional - defaults to "text"
    label: "Email Address",  // Optional - displayed as label
    required: true,          // Optional - makes field required
    validators: [],          // Optional - validation rules
    defaultValue: "",        // Optional - initial value
    placeholder: "you@example.com"  // Optional - placeholder text
  }
  // ... more fields
];
```

> ** Important:** Always type your fields with `FieldConfig[]` for better IDE support and type safety!

###  Understanding Validators

Each field can have multiple validators. They run in order and stop at the first failure:

```tsx
validators: [
  { type: "required", message: "Email is required" },
  { type: "email", message: "Enter a valid email" }
]
```

**Available Validators:**
- `required` - Field must not be empty
- `email` - Valid email format
- `minLength` - Minimum characters (use with `value` property)
- `maxLength` - Maximum characters (use with `value` property)
- `pattern` - Regex pattern matching
- `match` - Match another field value
- `number` - Must be a number
- `url` - Valid URL format
- `phone` - Valid phone format (exactly 10 digits)
- `custom` - Your own validation logic

## Features

### 1. Supported Field Types
- **Text Inputs:** `text`, `email`, `password`, `number`, `tel`, `url`, `date`, `datetime-local`
- **Complex Inputs:** `textarea`, `select`, `checkbox`, `radio`

### 2. Built-in Validators
- ✓ `required` - Required fields
- ✓ `email` - Email validation
- ✓ `minLength` - Minimum length validation
- ✓ `maxLength` - Maximum length validation
- ✓ `pattern` - RegExp pattern matching
- ✓ `match` - Match another field value (e.g., password confirmation)
- ✓ `custom` - Custom async/sync validators
- ✓ `number` - Number validation
- ✓ `url` - URL validation
- ✓ `phone` - Phone number validation (exactly 10 digits)

### 3. Real-time Validation Modes
Choose when validation runs:

```tsx
// Validates as user types (fastest feedback)
<DynamicForm fields={fields} validationMode="onChange" />

// Validates when field loses focus (default - balanced)
<DynamicForm fields={fields} validationMode="onBlur" />

// Validates only on form submission
<DynamicForm fields={fields} validationMode="onSubmit" />
```

Notes:
- In `onChange` mode, field validation is debounced by ~300ms. If the user pauses typing (e.g., typing `him@gm` and stopping), validation runs and the error appears smoothly without requiring blur.
- In `onBlur` mode, validation runs when the field loses focus.
- In `onSubmit` mode, validation runs for all fields upon submission only.

### 4. Async Validation & Submission (with Submit Throttling)
Perfect for checking username availability, email existence, etc.:

```tsx
const fields: FieldConfig[] = [
  {
    name: "username",
    label: "Username",
    validators: [{
      type: "custom",
      message: "Username already taken",
      custom: async (value) => {
        const response = await checkUsernameAvailability(value);
        return response.available; // returns boolean
      }
    }]
  }
];

// Async form submission
<DynamicForm
  fields={fields}
  onSubmit={async (values) => {
    await saveFormToAPI(values);
  }}
  // Prevent fast double-submits; default is 1000ms
  submitThrottleMs={1500}
/>
```

### 5. Beautiful Built-in Styles
```tsx
// Use default beautiful styles (recommended)
import 'formguardian-react/styles';
```

## Examples

- Quick start above shows a minimal login form.
- For a complete, real-world example with most field types and validators, see `src/components/EXAMPLE_ADVANCED_FORM.tsx`.

## API Reference

### DynamicForm Component
Main component for rendering forms with validation.

Props (most used):
- fields: FieldConfig[] (required)
- onSubmit: (values) => void | Promise<void> (required)
- validationMode?: 'onChange' | 'onBlur' | 'onSubmit' (default: 'onBlur')
- submitThrottleMs?: number (default: 1000)
- submitButtonText?: string, resetButtonText?: string, showResetButton?: boolean
- disabled?: boolean, className?: string

### FieldConfig Interface
Structure of each field (most common):
- name: string (required)
- type?: string (default: 'text')
- label?: string
- placeholder?: string
- required?: boolean
- disabled?: boolean
- defaultValue?: unknown
- validators?: (ValidationRule | string)[]
- rows?: number (for textarea)
- options?: Array<{ value: string | number; label: string }> (for select/radio/checkbox)

### Validator Types

#### Built-in String Validators
Simple validators can be passed as strings:

```tsx
validators: ['required', 'email', 'url', 'number', 'phone']
```

#### Object Validators with Options
Validators that need configuration:

```tsx
// Min/Max Length
{ type: 'minLength', value: 8, message: 'Minimum 8 characters' }
{ type: 'maxLength', value: 100, message: 'Maximum 100 characters' }

// Pattern Matching
{ type: 'pattern', value: /^[A-Z0-9]+$/, message: 'Only uppercase and numbers' }

// Match Another Field
{ type: 'match', matchField: 'password', message: 'Passwords must match' }

// Custom Validation
{
  type: 'custom',
  message: 'Custom error message',
  custom: (value, formData) => {
    // Return boolean or Promise<boolean>
    return value.length > 3;
  }
}
```

## Troubleshooting & FAQ

### ❓ How do I make a field required?
```tsx
{ name: 'email', required: true, validators: ['required'] }
```

### ❓ How do I validate dependent fields (e.g., confirm password)?
```tsx
{ type: 'match', matchField: 'password', message: 'Passwords do not match' }
```

### ❓ How do I validate against an API?
```tsx
{ type: 'custom', message: 'Username taken', custom: async (v) => (await fetch(`/api/check?u=${v}`)).ok }
```

### ❓ Validators not working?
Check: field has `name`, validators array shape is correct, string types are valid, object validators include `type`, and custom returns boolean/Promise<boolean>.

## More resources
- Full advanced example: `src/components/EXAMPLE_ADVANCED_FORM.tsx`

## License
MIT © [Himanshu Sinha](LICENSE)