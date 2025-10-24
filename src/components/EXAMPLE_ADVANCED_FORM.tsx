// Example: Advanced Form with Multiple Field Types and Validators

import { DynamicForm } from '../index';
import type { FieldConfig } from '../lib/types';

export function AdvancedForm() {
  const fields: FieldConfig[] = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'John',
      required: true,
      validators: [
        { type: 'required', message: 'First name is required' },
        { type: 'minLength', value: 2, message: 'Minimum 2 characters' }
      ]
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Doe',
      required: true,
      validators: ['required']
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'john@example.com',
      required: true,
      validators: [
        'required',
        'email'
      ]
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+1 (555) 000-0000',
      validators: ['phone']
    },
    {
      name: 'website',
      label: 'Website',
      type: 'url',
      validators: ['url']
    },
    {
      name: 'experience',
      label: 'Years of Experience',
      type: 'number',
      placeholder: '5',
      validators: [
        { type: 'number', message: 'Must be a number' }
      ]
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      placeholder: 'Tell us about yourself',
      rows: 4,
      validators: [
        { type: 'maxLength', value: 500, message: 'Max 500 characters' }
      ]
    },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      required: true,
      validators: ['required'],
      options: [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' },
        { value: 'au', label: 'Australia' }
      ]
    },
    {
      name: 'role',
      label: 'Professional Role',
      type: 'radio',
      required: true,
      validators: ['required'],
      options: [
        { value: 'developer', label: 'Developer' },
        { value: 'designer', label: 'Designer' },
        { value: 'manager', label: 'Manager' }
      ]
    },
    {
      name: 'languages',
      label: 'Languages (Select all that apply)',
      type: 'checkbox',
      options: [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'rust', label: 'Rust' }
      ]
    },
    {
      name: 'agreeToTerms',
      label: 'I agree to the terms and conditions',
      type: 'checkbox',
      required: true,
      validators: [
        { type: 'required', message: 'You must agree to the terms' }
      ]
    }
  ];

  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('Form submitted:', values);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message
    alert('Profile updated successfully!');
  };

  const handleError = (errors: Record<string, string>) => {
    console.log('Form errors:', errors);
  };

  const handleValuesChange = (values: Record<string, unknown>) => {
    console.log('Form values changed:', values);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">User Profile</h1>
        <p className="text-gray-600 mb-6">Update your profile information</p>
        
        <DynamicForm
          fields={fields}
          onSubmit={handleSubmit}
          onError={handleError}
          onValuesChange={handleValuesChange}
          validationMode="onBlur"
          validateOnMount={false}
          submitButtonText="Update Profile"
          resetButtonText="Clear Form"
          showResetButton={true}
        />
      </div>
    </div>
  );
}
