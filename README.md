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

### 📋 Field Configuration
Each field in the `fields` array describes how to render and validate a form input:

```tsx
const fields: FieldConfig[] = [
  {
    name: "email",           // ✅ REQUIRED - Unique field identifier
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

> **⚠️ Important:** Always type your fields with `FieldConfig[]` for better IDE support and type safety!

### 🔍 Understanding Validators

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
- `phone` - Valid phone format
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
- ✓ `phone` - Phone number validation

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

## Common Patterns & Examples

### ✅ Simple Login Form
```tsx
import { DynamicForm } from 'formguardian-react';
import type { FieldConfig } from 'formguardian-react';
import 'formguardian-react/styles';

export function LoginForm() {
  const fields: FieldConfig[] = [
    {
      name: "email",
      type: "email",
      label: "Email Address",
      required: true,
      validators: ['required', 'email']
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      required: true,
      validators: [
        { type: 'required', message: 'Password is required' },
        { type: 'minLength', value: 8, message: 'Min 8 characters' }
      ]
    }
  ];

  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('Login with:', values);
    // Make API call here
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

### ✅ Registration Form with Password Confirmation
```tsx
export function RegistrationForm() {
  const fields: FieldConfig[] = [
    {
      name: "email",
      type: "email",
      label: "Email Address",
      required: true,
      validators: ['required', 'email']
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      required: true,
      validators: [
        { type: 'minLength', value: 8, message: 'Min 8 characters' }
      ]
    },
    {
      name: "confirmPassword",
      type: "password",
      label: "Confirm Password",
      required: true,
      validators: [
        { type: 'match', matchField: 'password', message: 'Passwords do not match' }
      ]
    },
    {
      name: "terms",
      type: "checkbox",
      label: "I agree to the Terms & Conditions",
      required: true,
      validators: ['required']
    }
  ];

  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('Register with:', values);
  };

  return (
    <DynamicForm
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Account"
      showResetButton={true}
    />
  );
}
```

### ✅ Contact Form with Multiple Field Types
```tsx
export function ContactForm() {
  const fields: FieldConfig[] = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      validators: ['required']
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      required: true,
      validators: ['required', 'email']
    },
    {
      name: "subject",
      type: "select",
      label: "Subject",
      required: true,
      validators: ['required'],
      options: [
        { value: "support", label: "Support" },
        { value: "sales", label: "Sales Inquiry" },
        { value: "feedback", label: "Feedback" },
        { value: "other", label: "Other" }
      ]
    },
    {
      name: "message",
      type: "textarea",
      label: "Message",
      placeholder: "Please describe your inquiry...",
      required: true,
      rows: 5,
      validators: [
        { type: 'minLength', value: 10, message: 'Message must be at least 10 characters' },
        { type: 'maxLength', value: 1000, message: 'Message cannot exceed 1000 characters' }
      ]
    }
  ];

  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('Contact form submitted:', values);
    // Send email or save to database
  };

  return (
    <DynamicForm
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Send Message"
      validationMode="onBlur"
    />
  );
}
```

### ✅ Form with Custom Validation
```tsx
export function AdvancedForm() {
  const fields: FieldConfig[] = [
    {
      name: "username",
      label: "Username",
      type: "text",
      required: true,
      validators: [
        { type: 'minLength', value: 3, message: 'Min 3 characters' },
        {
          type: 'custom',
          message: 'Username already taken',
          custom: async (value) => {
            // Check availability from API
            const response = await fetch(`/api/check-username?u=${value}`);
            const data = await response.json();
            return data.available;
          }
        }
      ]
    }
  ];

  return (
    <DynamicForm
      fields={fields}
      onSubmit={(values) => console.log(values)}
      validationMode="onChange"
    />
  );
}
```

## API Reference

### DynamicForm Component
Main component for rendering forms with validation.

```tsx
<DynamicForm
  // ✅ REQUIRED
  fields={fieldArray}              // FieldConfig[] - Form field definitions
  onSubmit={handleSubmit}          // (values: Record<string, unknown>) => void | Promise<void>

  // Optional Callbacks
  onError={(errors) => {}}         // Triggered when validation errors occur
  onValuesChange={(values) => {}}  // Triggered when any field value changes
  
  // Configuration
  validationMode="onBlur"          // "onChange" | "onBlur" | "onSubmit"
  validateOnMount={false}          // Run validation on component mount
  submitThrottleMs={1000}          // Throttle valid submissions (ms). Prevents rapid resubmits.
  
  // UI Options
  submitButtonText="Submit"        // Custom submit button label
  resetButtonText="Reset"          // Custom reset button label
  showResetButton={false}          // Show/hide reset button
  disabled={false}                 // Disable entire form
  className="my-form"              // Additional CSS class
/>
```

### FieldConfig Interface
Defines the structure of each form field.

```tsx
{
  // ✅ REQUIRED
  name: string,                    // Unique field identifier

  // Display & Input
  label?: string,                  // Field label text
  placeholder?: string,            // Placeholder text
  type?: string,                   // Input type (default: "text")
  
  // Behavior
  required?: boolean,              // Is field required?
  disabled?: boolean,              // Is field disabled?
  defaultValue?: unknown,          // Initial value
  
  // Validation
  validators?: (ValidationRule | string)[],  // Validation rules
  
  // Field-specific
  rows?: number,                   // For textarea - number of rows
  options?: Array<{                // For select/radio/checkbox
    value: string | number,
    label: string
  }>
}
```

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

### ❓ **How do I make a field required?**
```tsx
// Option 1: Add required validator
{ name: 'email', validators: ['required'] }

// Option 2: Use required property (for visual indicator)
{ name: 'email', required: true, validators: ['required'] }
```

### ❓ **How do I validate dependent fields (e.g., password confirmation)?**
```tsx
{
  name: 'confirmPassword',
  type: 'password',
  label: 'Confirm Password',
  validators: [
    { type: 'match', matchField: 'password', message: 'Passwords do not match' }
  ]
}
```

### ❓ **How do I validate against an API (e.g., check username availability)?**
```tsx
{
  name: 'username',
  validators: [{
    type: 'custom',
    message: 'Username is already taken',
    custom: async (value) => {
      const res = await fetch(`/api/check?u=${value}`);
      return res.ok;
    }
  }]
}
```

### ❓ **Why aren't my validators working?**
✅ Make sure:
- Field has `name` property (required)
- Validators are defined as array: `validators: [...]`
- String validators use correct type: `'required'`, `'email'`, etc.
- Object validators have `type` property
- For custom validators, `custom` function must return `boolean` or `Promise<boolean>`

### ❓ **How do I access form values in onSubmit?**
```tsx
<DynamicForm
  fields={fields}
  onSubmit={(values) => {
    console.log('Email:', values.email);
    console.log('Password:', values.password);
    // values object contains all field values
  }}
/>
```

### ❓ **Can I update field values programmatically?**
Currently, field values are controlled by user input. For dynamic updates, use `defaultValue`:

```tsx
const [defaultEmail, setDefaultEmail] = useState('');

const fields: FieldConfig[] = [
  { name: 'email', defaultValue: defaultEmail }
];

// Later, update setDefaultEmail to reset the form
```

### ❓ **How do I disable the submit button until form is valid?**
By default, the button is disabled while submitting and during the throttle window (`submitThrottleMs`), or if you pass `disabled` to the form.

If you also want to disable submit while there are validation errors, derive a `disabled` flag from the errors via `onError`:

```tsx
function MyForm() {
  const [hasErrors, setHasErrors] = useState(false);

  return (
    <DynamicForm
      fields={fields}
      onSubmit={handleSubmit}
      onError={(errors) => setHasErrors(Object.values(errors).some(Boolean))}
      validationMode="onChange"
      submitThrottleMs={1500}
      disabled={hasErrors}
    />
  );
}
```

### ❓ **Where's the documentation for all features?**
Check out these files:
- `docs/GETTING_STARTED.md` - Detailed getting started guide
- `docs/EXAMPLE_ADVANCED_FORM.tsx` - Complete example with all field types
- `docs/FIELDCONFIG_USAGE.md` - When and how to use field configurations

## License
MIT © [Himanshu Sinha](LICENSE)