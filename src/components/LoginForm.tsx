import React from 'react';
import { DynamicForm } from "../index";
import type { FieldConfig } from "../lib/types";

const loginFields: FieldConfig[] = [
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "you@example.com",
    required: true,
    validators: [
      { type: "required", message: "Email is required" },
      { type: "email", message: "Please enter a valid email address" }
    ]
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
    validators: [
      { type: "required", message: "Password is required" },
      { type: "minLength", value: 6, message: "Password must be at least 6 characters" }
    ]
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your password",
    required: true,
    validators: [
      { type: "required", message: "Please confirm your password" },
      { type: "match", matchField: "password", message: "Passwords do not match" }
    ]
  },
  {
    name: "rememberMe",
    label: "Remember me",
    type: "checkbox",
    required: false
  }
];

const LoginForm: React.FC = () => {
  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log("Form submitted with values:", values);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert("Login successful!");
  };

  const handleError = (errors: Record<string, string>) => {
    console.log("Form errors:", errors);
  };

  const handleValuesChange = (values: Record<string, unknown>) => {
    console.log("Form values changed:", values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to your account</p>
        <DynamicForm
          fields={loginFields}
          onSubmit={handleSubmit}
          onError={handleError}
          onValuesChange={handleValuesChange}
          validationMode="onBlur"
          submitButtonText="Sign In"
          showResetButton={true}
          customization={{
            showAnimations: true,
            animationDuration: 300,
          }}
        />
      </div>
    </div>
  );
}

export default LoginForm;