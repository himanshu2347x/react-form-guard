# FormGuardian React - Test & Usage Guide

## Installation

```bash
npm install formguardian-react
```

---

## ✅ Quick Test - Copy & Paste Ready Code

### Option 1: React Vite Project (Recommended)

Create a new Vite React project:
```bash
npm create vite@latest my-form-app -- --template react
cd my-form-app
npm install
npm install formguardian-react
```

Replace your `src/App.jsx` with:

```jsx
import React from 'react'
import { DynamicForm } from 'formguardian-react'
import 'formguardian-react/dist/formguardian-react.css'

function App() {
  const fields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'your@email.com',
      validators: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' }
      ]
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password',
      validators: [
        { type: 'required', message: 'Password is required' },
        { type: 'minLength', value: 6, message: 'Min 6 characters' }
      ]
    }
  ]

  const handleSubmit = async (values) => {
    console.log('✅ Form submitted:', values)
    alert('Form is valid! Check console.')
  }

  const handleError = (errors) => {
    console.log('❌ Form errors:', errors)
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h1>FormGuardian React Test</h1>
      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        onError={handleError}
        validationMode="onBlur"
        submitButtonText="Login"
      />
    </div>
  )
}

export default App
```

Then run:
```bash
npm run dev
```

---

### Option 2: Next.js Project

```bash
npx create-next-app@latest my-form-app
cd my-form-app
npm install formguardian-react
```

Create `app/page.tsx`:

```tsx
'use client'

import { DynamicForm } from 'formguardian-react'
import 'formguardian-react/dist/formguardian-react.css'

export default function Home() {
  const fields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter username',
      validators: [
        { type: 'required', message: 'Username required' },
        { type: 'minLength', value: 3, message: 'Min 3 characters' }
      ]
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      validators: [
        { type: 'required', message: 'Email required' },
        { type: 'email', message: 'Invalid email' }
      ]
    }
  ]

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h1>FormGuardian Test</h1>
      <DynamicForm
        fields={fields}
        onSubmit={(values) => console.log('Form data:', values)}
        validationMode="onChange"
      />
    </div>
  )
}
```

---

### Option 3: Plain React + TypeScript

```bash
npm create vite@latest my-form-app -- --template react-ts
cd my-form-app
npm install formguardian-react
```

Replace `src/App.tsx`:

```tsx
import React from 'react'
import { DynamicForm, type FieldConfig } from 'formguardian-react'
import 'formguardian-react/dist/formguardian-react.css'

function App() {
  const loginFields: FieldConfig[] = [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'test@example.com',
      required: true,
      validators: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter valid email' }
      ]
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password',
      required: true,
      validators: [
        { type: 'required', message: 'Password required' },
        { type: 'minLength', value: 6, message: 'Min 6 characters' }
      ]
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      validators: [
        { type: 'match', matchField: 'password', message: 'Passwords do not match' }
      ]
    }
  ]

  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('✅ Form Values:', values)
    // Make API call here
    alert('✅ Form is valid!')
  }

  return (
    <div style={{ maxWidth: '600px', margin: '60px auto', padding: '30px' }}>
      <h1>🔐 FormGuardian React Test</h1>
      <DynamicForm
        fields={loginFields}
        onSubmit={handleSubmit}
        onError={(errors) => console.log('Errors:', errors)}
        validationMode="onBlur"
        validateOnMount={false}
        submitButtonText="Sign In"
        showResetButton={true}
        customization={{
          showAnimations: true,
          animationDuration: 300
        }}
      />
    </div>
  )
}

export default App
```

---

## 🧪 Validation Modes

Test different validation modes by changing `validationMode`:

### onChange (Real-time validation)
```jsx
<DynamicForm
  fields={fields}
  validationMode="onChange"  // Validates as you type
  onSubmit={handleSubmit}
/>
```

### onBlur (Validate when field loses focus)
```jsx
<DynamicForm
  fields={fields}
  validationMode="onBlur"  // Validates when you leave field
  onSubmit={handleSubmit}
/>
```

### onSubmit (Validate on form submission)
```jsx
<DynamicForm
  fields={fields}
  validationMode="onSubmit"  // Validates only on submit
  onSubmit={handleSubmit}
/>
```

---

## 📝 Available Validators

```jsx
const fields = [
  {
    name: 'field',
    label: 'Field Label',
    type: 'text',
    validators: [
      { type: 'required', message: 'This is required' },
      { type: 'email', message: 'Invalid email' },
      { type: 'minLength', value: 5, message: 'Min 5 chars' },
      { type: 'maxLength', value: 20, message: 'Max 20 chars' },
      { type: 'pattern', value: '^[a-z]+$', message: 'Lowercase only' },
      { type: 'number', message: 'Must be a number' },
      { type: 'url', message: 'Invalid URL' },
      { type: 'phone', message: 'Invalid phone' },
      { type: 'match', matchField: 'other_field', message: 'Must match' },
      { 
        type: 'custom', 
        validator: (value) => value.includes('test'),
        message: 'Must include "test"' 
      }
    ]
  }
]
```

---

## 🎨 Supported Field Types

```jsx
const fields = [
  { name: 'text_field', type: 'text', label: 'Text' },
  { name: 'email_field', type: 'email', label: 'Email' },
  { name: 'password_field', type: 'password', label: 'Password' },
  { name: 'number_field', type: 'number', label: 'Number' },
  { name: 'tel_field', type: 'tel', label: 'Phone' },
  { name: 'url_field', type: 'url', label: 'URL' },
  { name: 'date_field', type: 'date', label: 'Date' },
  { name: 'datetime_field', type: 'datetime-local', label: 'DateTime' },
  { name: 'textarea_field', type: 'textarea', label: 'Message' },
  { 
    name: 'select_field', 
    type: 'select', 
    label: 'Options',
    options: [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' }
    ]
  },
  { name: 'checkbox_field', type: 'checkbox', label: 'Agree' },
  { 
    name: 'radio_field', 
    type: 'radio', 
    label: 'Choose',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]
  }
]
```

---

## 🎯 Complete Working Example

Save as `test-form.jsx`:

```jsx
import React from 'react'
import { DynamicForm } from 'formguardian-react'
import 'formguardian-react/dist/formguardian-react.css'

export default function TestForm() {
  const fields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'John Doe',
      validators: [
        { type: 'required', message: 'Name is required' },
        { type: 'minLength', value: 3, message: 'Name must be at least 3 characters' }
      ]
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'john@example.com',
      validators: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email' }
      ]
    },
    {
      name: 'website',
      label: 'Website (Optional)',
      type: 'url',
      placeholder: 'https://example.com',
      validators: [
        { type: 'url', message: 'Please enter a valid URL' }
      ]
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Your message here...',
      validators: [
        { type: 'required', message: 'Message is required' },
        { type: 'minLength', value: 10, message: 'Message must be at least 10 characters' }
      ]
    },
    {
      name: 'agree',
      label: 'I agree to the terms and conditions',
      type: 'checkbox',
      validators: [
        { type: 'required', message: 'You must agree to continue' }
      ]
    }
  ]

  const handleSubmit = async (values) => {
    console.log('✅ Form submitted successfully!')
    console.log('Form data:', values)
    
    // Simulate API call
    try {
      // await fetch('/api/submit', { method: 'POST', body: JSON.stringify(values) })
      alert(`✅ Success! Hello ${values.name}`)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleError = (errors) => {
    console.log('❌ Validation errors:', errors)
  }

  const handleValuesChange = (values) => {
    console.log('Current form values:', values)
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🎯 FormGuardian React Demo
      </h1>
      
      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        onError={handleError}
        onValuesChange={handleValuesChange}
        validationMode="onBlur"
        validateOnMount={false}
        submitButtonText="Submit Form"
        showResetButton={true}
        customization={{
          showAnimations: true,
          animationDuration: 300
        }}
      />

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>💡 Tips:</strong>
        <ul>
          <li>Try submitting with empty fields to see validation</li>
          <li>Check browser console for form data</li>
          <li>Animations play when fields are validated</li>
          <li>Errors appear with shake animation</li>
        </ul>
      </div>
    </div>
  )
}
```

---

## ✨ Expected Behavior When Testing

✅ **Empty Field Submit** → Shows "This field is required" error
✅ **Invalid Email** → Shows "Please enter a valid email" error  
✅ **Short Password** → Shows "Min X characters" error
✅ **Valid Data** → Submits successfully, shows alert
✅ **Animations** → Fields slide in, shake on error, pulse on focus

---

## 🔗 Import Styles

Don't forget to import the CSS:

```jsx
// For ES6/JSX
import 'formguardian-react/dist/formguardian-react.css'

// Or in your main.css
@import 'formguardian-react/dist/formguardian-react.css';
```

---

## 🎨 Customization

```jsx
<DynamicForm
  fields={fields}
  customization={{
    showAnimations: true,              // Enable animations
    animationDuration: 300,            // Animation speed (ms)
    inputClass: 'custom-input',        // Custom CSS class
    errorClass: 'custom-error',        // Custom error class
    labelClass: 'custom-label'         // Custom label class
  }}
  onSubmit={handleSubmit}
/>
```

---

## 🆘 Troubleshooting

**Issue:** Styles not loading
- ✅ Make sure to import the CSS: `import 'formguardian-react/dist/formguardian-react.css'`

**Issue:** TypeScript errors
- ✅ Import types: `import type { FieldConfig } from 'formguardian-react'`

**Issue:** Validation not working
- ✅ Check console for errors
- ✅ Verify validator names are correct
- ✅ Ensure field names match

**Issue:** Package not found
- ✅ Run `npm install formguardian-react`
- ✅ Check `node_modules` folder exists

---

Happy testing! 🚀
