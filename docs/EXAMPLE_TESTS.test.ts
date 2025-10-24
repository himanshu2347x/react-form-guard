// Example Testing Guide for React Form Guard
// Using React Testing Library and Vitest

/*
 * This file demonstrates common testing patterns for forms built with React Form Guard.
 * To run these tests, install the following dependencies:
 * 
 * npm install --save-dev vitest @testing-library/react @testing-library/user-event
 * 
 * Then run: npm test
 */

/*
 * Example test cases structure:
 * 
 * describe('DynamicForm Component', () => {
 *   describe('Rendering', () => {
 *     it('should render form with all fields')
 *     it('should render submit button with custom text')
 *     it('should render reset button when enabled')
 *   })
 * 
 *   describe('Validation', () => {
 *     it('should show error for invalid email on blur')
 *     it('should show error for short password')
 *     it('should not show errors for valid input')
 *   })
 * 
 *   describe('Form Submission', () => {
 *     it('should call onSubmit with form values when valid')
 *     it('should not call onSubmit when validation fails')
 *     it('should disable submit button while submitting')
 *   })
 * 
 *   describe('Form Reset', () => {
 *     it('should reset form values to initial state')
 *   })
 * 
 *   describe('Callbacks', () => {
 *     it('should call onValuesChange when field value changes')
 *     it('should call onError with validation errors')
 *   })
 * 
 *   describe('Field Types', () => {
 *     it('should render select field with options')
 *     it('should render checkbox field')
 *     it('should render textarea field')
 *   })
 * 
 *   describe('Accessibility', () => {
 *     it('should have proper aria attributes for error states')
 *     it('should have associated labels for all inputs')
 *   })
 * })
 */

// Test field setup example:
export const mockFields = [
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
      { type: 'required' },
      { type: 'minLength', value: 6 }
    ]
  }
];

// Testing tips:
// 1. Use data-testid for complex queries
// 2. Test user interactions, not implementation
// 3. Use waitFor() for async validations
// 4. Mock async validators with setTimeout
// 5. Test accessibility attributes
// 6. Verify form submissions are prevented on errors
// 7. Test field change and blur events separately
// 8. Verify proper ARIA labels and error messages

// Example snapshot test:
// it('should match snapshot', () => {
//   const { container } = render(
//     <DynamicForm fields={mockFields} onSubmit={jest.fn()} />
//   );
//   expect(container).toMatchSnapshot();
// });
