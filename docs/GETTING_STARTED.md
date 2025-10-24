# Getting Started with React Form Guard

Welcome to React Form Guard! This guide will help you get started quickly.

## Installation

```bash
npm install formguardian-react
```

## Basic Setup

### 1. Import Components

```jsx
import { DynamicForm } from 'formguardian-react';
import 'formguardian-react/styles'; // Optional: default styles
```

### 2. Define Your Fields

```jsx
const fields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validators: ['required', 'email']
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    validators: [
      'required',
      { type: 'minLength', value: 6 }
    ]
  }
];
```

### 3. Create Your Form

```jsx
function LoginForm() {
  const handleSubmit = (values) => {
    console.log('Form values:', values);
    // Send to your API
  };

  return (
    <DynamicForm
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Login"
    />
  );
}

export default LoginForm;
```

## Key Concepts

### Validation Rules

Validation happens based on your `validators` array in each field. Each validator is either:

1. **String shorthand** (for simple validators):
   ```js
   validators: ['required', 'email']
   ```

2. **Object with configuration**:
   ```js
   validators: [
     { type: 'required', message: 'Custom error message' },
     { type: 'minLength', value: 8 }
   ]
   ```

### Validation Modes

Control when validation occurs:

- `'onSubmit'` (default) - Validate only when form is submitted
- `'onBlur'` - Validate when user leaves a field
- `'onChange'` - Validate as user types (real-time)

```jsx
<DynamicForm
  fields={fields}
  onSubmit={handleSubmit}
  validationMode="onChange"
/>
```

### Handling Form Callbacks

```jsx
<DynamicForm
  fields={fields}
  onSubmit={(values) => {
    // Fired when form is successfully submitted
    console.log('Submitted:', values);
  }}
  onError={(errors) => {
    // Fired when validation fails
    console.log('Errors:', errors);
  }}
  onValuesChange={(values) => {
    // Fired whenever any field value changes
    console.log('Values:', values);
  }}
/>
```

## Common Patterns

### Form with Reset Button

```jsx
<DynamicForm
  fields={fields}
  onSubmit={handleSubmit}
  showResetButton={true}
  resetButtonText="Clear"
/>
```

### Conditional Validation

```jsx
const fields = [
  {
    name: 'country',
    label: 'Country',
    type: 'select',
    options: [...]
  },
  {
    name: 'state',
    label: 'State',
    type: 'text',
    validators: [
      {
        type: 'custom',
        custom: (value, formData) => {
          // Only validate if country is USA
          if (formData.country !== 'us') return true;
          return value.length === 2;
        }
      }
    ]
  }
];
```

### Custom Validation

```jsx
{
  name: 'username',
  label: 'Username',
  validators: [
    {
      type: 'custom',
      custom: async (value) => {
        // Check if username is available
        const response = await fetch(`/api/check-username/${value}`);
        const data = await response.json();
        return data.available;
      },
      message: 'Username is already taken'
    }
  ]
}
```

### Password Confirmation

```jsx
const fields = [
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    validators: ['required', { type: 'minLength', value: 8 }]
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    validators: [
      {
        type: 'match',
        matchField: 'password',
        message: 'Passwords do not match'
      }
    ]
  }
];
```

## Field Types

All standard HTML input types are supported:

```jsx
// Text input
{ name: 'name', type: 'text' }

// Email input
{ name: 'email', type: 'email' }

// Password input
{ name: 'password', type: 'password' }

// Number input
{ name: 'age', type: 'number' }

// Textarea
{ name: 'message', type: 'textarea', rows: 5 }

// Select dropdown
{
  name: 'country',
  type: 'select',
  options: [
    { value: 'us', label: 'USA' },
    { value: 'uk', label: 'UK' }
  ]
}

// Checkbox
{ name: 'agree', type: 'checkbox' }

// Radio buttons
{
  name: 'role',
  type: 'radio',
  options: [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' }
  ]
}

// Date
{ name: 'birthDate', type: 'date' }

// URL
{ name: 'website', type: 'url' }

// Phone
{ name: 'phone', type: 'tel' }
```

## Built-in Validators

```jsx
// Required field
{ type: 'required' }

// Email validation
{ type: 'email' }

// Minimum length
{ type: 'minLength', value: 5 }

// Maximum length
{ type: 'maxLength', value: 50 }

// Regex pattern
{ type: 'pattern', value: /^[A-Z].*/ }

// Match another field
{ type: 'match', matchField: 'password' }

// Number validation
{ type: 'number' }

// URL validation
{ type: 'url' }

// Phone validation
{ type: 'phone' }
```

## Using Hooks

For more control, use the hooks directly:

```jsx
import { useFormValidator } from 'formguardian-react';

function MyCustomForm() {
  const {
    formState,           // { values, errors, touched, isValid }
    setFieldValue,       // Update single field
    setFieldTouched,     // Mark field as touched
    validateFormFields,  // Validate all fields
    resetForm            // Reset to initial state
  } = useFormValidator(fields, 'onBlur');

  return (
    <>
      <input
        value={formState.values.email}
        onChange={(e) => setFieldValue('email', e.target.value)}
        onBlur={() => setFieldTouched('email')}
      />
      {formState.errors.email && (
        <span className="error">{formState.errors.email}</span>
      )}
    </>
  );
}
```

## Styling

### Using Default Styles

```jsx
import 'formguardian-react/styles';
```

### Custom CSS Classes

```jsx
<DynamicForm
  fields={fields}
  onSubmit={handleSubmit}
  customization={{
    inputClass: 'my-input',
    errorClass: 'my-error',
    buttonClass: 'my-button',
    containerClass: 'my-form'
  }}
/>
```

### Custom Animations

```jsx
<DynamicForm
  fields={fields}
  onSubmit={handleSubmit}
  customization={{
    showAnimations: true,
    animationDuration: 500  // ms
  }}
/>
```

## Next Steps

- Check out [Advanced Examples](./docs/EXAMPLE_ADVANCED_FORM.tsx)
- Read the [Full API Documentation](./README.md)
- View [Type Definitions](../src/lib/types.ts)

## Need Help?

- Check the [FAQ](./FAQ.md)
- Open an [Issue](https://github.com/yourusername/formguardian-react/issues)
- Read the [Examples](./docs/)

Happy form building! 🎉
