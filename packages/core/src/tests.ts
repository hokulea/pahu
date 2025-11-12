/* eslint-disable unicorn/no-empty-file */
// some type tests below
// uncomment for quick feedback - not all is testable with type tests (yet?)

// import { createForm, type FormValidationHandler, type SubmitHandler } from './form';

// const submitHandler: SubmitHandler<{ some: string }> = (data) =>
//   console.log('Submit Handler', data);
// const validationHandler: FormValidationHandler<{ username: string }> = ({ data }) => ({
//   message: `${data.username} is wrong`
// });

// const deepForm = createForm({
//   data: {
//     username: '',
//     profile: { givenName: '', familyName: '' },
//     emails: [
//       { email: '', verified: true, primary: true },
//       { email: '', verified: false, primary: false }
//     ]
//   },
//   submit: submitHandler,
//   validate: validationHandler
// });

// deepForm.createField({ name: '' });

// const form = createForm({ data: { givenName: '' } });

// form.createField({ name: 'csie', value: 123 });

// const givenName = form.createField({ name: 'givenName' });

// givenName.value;

// form.createField({ name: 'givenName', value: 123 });
// //                                    ^?
// // TS Error (weak): Type 'number' is not assignable to type 'string'.
// // TS Error (strong): Object literal may only specify known properties, and 'value' does not exist in type

// form.createField({ name: 'oink', value: 123 });
// form.createField({
//   name: 'oink2',
//   value: '123',
//   validate: ({ value }) => (value === 456 ? 'die alte hex' : undefined)
//   //                        ^?
//   // TS Error: This comparison appears to be unintentional because the types 'string | undefined' and 'number' have no overlap
// });

// form.createField({
//   name: 'email',
//   value: 'localhost@domain',
//   validate: ({ value }) => (value.includes('@') ? undefined : 'Email must include an @ sign')
//   //                        ^?
//   // TS Error: 'value' is possibly 'undefined'
// });
