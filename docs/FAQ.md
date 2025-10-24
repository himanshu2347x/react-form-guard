# React Form Guard - FAQ & Troubleshooting

## Frequently Asked Questions

### Q: How do I use React Form Guard in my project?
**A:** Install via npm and import the components:
```bash
npm install formguardian-react
```

```jsx
import { DynamicForm } from 'formguardian-react';
```

### Q: Can I validate multiple fields at once?
**A:** Yes, the form validates all fields and shows errors for each one. Use the `onError` callback to handle multiple errors:
```jsx
<DynamicForm
  fields={fields}
  onSubmit={handleSubmit}
  onError={(errors) => {
    // errors is an object with fieldName: errorMessage
    console.log(errors);
  }}
/>
```

### Q: How do I create custom validators?
**A:** Use the 'custom' type with a validation function:
```jsx
{
  name: 'username',
  validators: [
    {
      type: 'custom',
      custom: (value) => value.length > 3,
      message: 'Username must be longer than 3 characters'
    }
  ]
}
```

### Q: Does it support async validation?
**A:** Yes! Return a Promise from the custom validator:
```jsx
{
  type: 'custom',
  custom: async (value) => {
    const response = await fetch(`/api/check/${value}`);
    return response.ok;
  }
}
```

### Q: How do I style the form?
**A:** Use the `customization` prop to add custom CSS classes:
```jsx
<DynamicForm
  fields={fields}
  onSubmit={handleSubmit}
  customization={{
    inputClass: 'my-custom-input',
    errorClass: 'my-custom-error',
    buttonClass: 'my-custom-button'
  }}
/>
```

### Q: Can I disable animations?
**A:** Yes, set `showAnimations` to false:
```jsx
customization={{
  showAnimations: false
}}
```

### Q: How do I get the form values?
**A:** Use the `onValuesChange` callback:
```jsx
<DynamicForm
  fields={fields}
  onSubmit={handleSubmit}
  onValuesChange={(values) => {
    console.log('Current values:', values);
  }}
/>
```

### Q: Can I use hooks instead of the component?
**A:** Yes! Use `useFormValidator` for more control:
```jsx
import { useFormValidator } from 'formguardian-react';

const { formState, setFieldValue, validateFormFields } = useFormValidator(fields);
```

### Q: How do I match two fields (like password confirmation)?
**A:** Use the 'match' validator type:
```jsx
{
  name: 'confirmPassword',
  validators: [
    {
      type: 'match',
      matchField: 'password',
      message: 'Passwords do not match'
    }
  ]
}
```

### Q: What validation modes are available?
**A:** Three modes:
- `'onSubmit'` - Validate only when form is submitted
- `'onBlur'` - Validate when user leaves a field (default)
- `'onChange'` - Validate as user types (real-time)

### Q: How do I reset the form?
**A:** Show the reset button or call the reset hook:
```jsx
// Component prop
<DynamicForm showResetButton={true} />

// Or with hooks
const { resetForm } = useFormValidator(fields);
resetForm(); // Call in a button click handler
```

### Q: Can I validate on mount?
**A:** Yes, set `validateOnMount` to true:
```jsx
<DynamicForm
  fields={fields}
  onSubmit={handleSubmit}
  validateOnMount={true}
/>
```

### Q: Does it support field dependencies?
**A:** Yes, use custom validators with form data:
```jsx
{
  type: 'custom',
  custom: (value, formData) => {
    // Access other field values
    if (formData.country === 'US') {
      return value.length === 5; // ZIP code validation
    }
    return true;
  }
}
```

### Q: What field types are supported?
**A:** text, email, password, number, tel, url, date, datetime-local, textarea, select, checkbox, radio

### Q: Can I disable specific fields?
**A:** Yes, use the `disabled` property:
```jsx
{
  name: 'field',
  disabled: true
}
```

### Q: How do I show loading state on submit button?
**A:** Use the `isSubmitting` state from the form submission hook or let it happen automatically.

---

## Troubleshooting

### Issue: Form is not validating
**Solution:** 
- Check that validators are properly defined
- Ensure `validationMode` is set correctly
- Check browser console for errors

### Issue: Custom validator not working
**Solution:**
- Make sure to return a boolean (or Promise<boolean>)
- Check that the validator function has the correct signature
- Test the validator logic independently

### Issue: Animations not showing
**Solution:**
- Make sure `showAnimations` is not set to false
- Check that CSS is imported correctly
- Verify browser supports CSS animations
- Check for CSS conflicts in your stylesheets

### Issue: Form values not updating
**Solution:**
- Check `onChange` and `onBlur` handlers are properly configured
- Verify field names match exactly in the fields array
- Check browser DevTools to see form state changes

### Issue: Styles not applying
**Solution:**
- Import the default styles: `import 'formguardian-react/styles'`
- Check CSS class conflicts with your stylesheet
- Use browser DevTools to inspect applied styles
- Ensure CSS specificity isn't being overridden

### Issue: TypeScript errors
**Solution:**
- Make sure you're using FieldConfig type for fields array
- Check that all required properties are provided
- Use proper types for callbacks (Record<string, unknown>)

### Issue: Performance degradation with many fields
**Solution:**
- Consider splitting into multiple forms
- Use `onChange` validation mode sparingly
- Implement field-level memoization if needed
- Profile with React DevTools

### Issue: Validation message not showing
**Solution:**
- Verify error CSS class is defined
- Check that field is marked as touched
- Ensure validation mode is not 'onSubmit' only
- Check for CSS visibility issues

### Issue: Form not submitting
**Solution:**
- Ensure all required fields have values
- Check for validation errors
- Verify `onSubmit` handler is defined
- Check for JavaScript errors in console

### Issue: Custom validator hangs
**Solution:**
- Ensure async function resolves
- Add timeout to prevent infinite waits
- Check for circular dependencies in validators
- Debug promise resolution

---

## Performance Tips

1. **Memoize validators** to prevent unnecessary re-evaluations
2. **Use `onBlur` mode** instead of `onChange` for better performance
3. **Split large forms** into multiple smaller forms
4. **Lazy load** complex fields if needed
5. **Disable animations** on slower devices: `showAnimations: false`

---

## Accessibility

The form is built with accessibility in mind:
- ✅ ARIA labels and descriptions
- ✅ Semantic HTML
- ✅ Keyboard navigation support
- ✅ Error announcements
- ✅ Focus indicators
- ✅ High contrast support

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Community & Support

- Report issues: [GitHub Issues](https://github.com/yourusername/formguardian-react/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/formguardian-react/discussions)
- Documentation: [README.md](./README.md)

---

**Can't find your answer?** Open an issue on GitHub! 🙌
