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
import 'formguardian-react/styles';

// Define your form fields
const loginFields = [
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

// Create your form component
function LoginForm() {
  const handleSubmit = (values) => {
    console.log('Form values:', values);
  };

  return (
    <DynamicForm
      fields={loginFields}
      onSubmit={handleSubmit}
      submitButtonText="Sign In"
    />
  );
}
```

## Features

### 1. Field Types
- Text, Email, Password
- Number, Tel, URL
- Textarea, Select
- Checkbox, Radio
- Date, DateTime

### 2. Built-in Validators
- ✓ Required fields
- ✓ Email format
- ✓ Min/max length
- ✓ Pattern matching
- ✓ Field matching
- ✓ Custom validators

### 3. Real-time Validation
```tsx
// Validate as user types
<DynamicForm
  fields={fields}
  validationMode="onChange"
/>

// Validate when field loses focus
<DynamicForm
  fields={fields}
  validationMode="onBlur"
/>
```

### 4. Async Validation & Submission
```tsx
const fields = [
  {
    name: "username",
    validators: [{
      type: "custom",
      message: "Username taken",
      custom: async (value) => {
        const response = await checkUsername(value);
        return response.available;
      }
    }]
  }
];

// Async form submission
<DynamicForm
  fields={fields}
  onSubmit={async (values) => {
    await saveToAPI(values);
  }}
/>
```

### 5. Easy Styling
```tsx
// Add custom classes
<DynamicForm
  customization={{
    containerClass: "my-form",
    inputClass: "my-input",
    buttonClass: "my-button"
  }}
/>

// Or use default beautiful styles
import 'formguardian-react/styles';
```

## Common Examples

### Registration Form
```tsx
const registrationFields = [
  {
    name: "email",
    type: "email",
    label: "Email Address",
    required: true
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    validators: [
      { type: "minLength", value: 8 }
    ]
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm Password",
    validators: [
      { type: "match", matchField: "password" }
    ]
  },
  {
    name: "terms",
    type: "checkbox",
    label: "I accept the terms",
    required: true
  }
];
```

### Contact Form
```tsx
const contactFields = [
  {
    name: "name",
    label: "Full Name",
    required: true
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    required: true
  },
  {
    name: "subject",
    type: "select",
    label: "Subject",
    options: [
      { value: "support", label: "Support" },
      { value: "sales", label: "Sales" }
    ]
  },
  {
    name: "message",
    type: "textarea",
    label: "Message",
    rows: 4,
    required: true
  }
];
```

## API Quick Reference

### DynamicForm Props
```tsx
<DynamicForm
  // Required props
  fields={fields}               // Field configurations
  onSubmit={(values) => {}}    // Form submission handler

  // Optional props
  validationMode="onBlur"      // "onChange" | "onBlur" | "onSubmit"
  onError={(errors) => {}}     // Error callback
  onValuesChange={() => {}}    // Values change callback
  validateOnMount={false}       // Validate on initial render
  submitButtonText="Submit"     // Custom submit button text
  showResetButton={true}       // Show reset button
  disabled={false}             // Disable entire form
  className="custom-form"      // Additional CSS class
/>
```

### Field Configuration
```tsx
{
  name: "fieldName",           // Unique identifier
  type: "text",               // Input type
  label: "Field Label",       // Display label
  placeholder: "Enter...",    // Placeholder text
  required: true,             // Is required
  disabled: false,            // Is disabled
  validators: [],             // Validation rules
  defaultValue: "",           // Initial value
  className: "custom-field"   // Additional CSS class
}
```

## License
MIT © [Himanshu Sinha](LICENSE)