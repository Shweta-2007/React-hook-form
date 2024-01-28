# REACT-HOOK-FORM

- Install react hook form library
- call the use form hook within our component

1. Form state management

- npm install -D @hookform/devtools
  Invoke the DevTool component after the closing form tag
  Associate this component with the form we are tracking, for that useform hook returns a control object that we can destructure from form.
  const { register, control } = form;

2. To handle form submission with react-hook-form

// The process involves three simple steps:
// (a) Define the function which should be called when submit button is to be called
// (b) From the form object, destructure a function called handleSubmit. Listen to the form onSubmit event and assign handleSubmit as a handler.To handleSubmit, pass the onSubmit as an argument.By doing this,the onSubmit function automatically receives access to the form data, which we can log to the console.
// (c) Fix the typescript error related to data.React hook form requires us to define the type of form data being submitted.

3. Form validation with react hook form

- noValidate attribute on the form element prevent browser validation allowing react hook form to handle the validation of the fields
- add the required field validation to the username field => pass in object as the second argument to the register function then specify required as the key and the corresponding error message as its value
- pattern validation: It ensures that the email input is in the correct format, as second argument t the register function, specify an object, set key as pattern and the va;ue is an object.The object contains two properties: value, which is the regex pattern for email and message which is surfaced back to the user when the pattern matching fails

4. To surface the error message to user

- From the form object, we can destructure an object called the formState. This formState contains quite a bit of information.But here we are only interested in errors object. Destructure errors from formState.
  the errors object contains the individual field errors that have failed validations.
  <p>{errors.username?.message}</p>

5. Custom validation to the form field:
   \*\* For example we want to prevent user from entering email as admin@example.com since it is reserved only for internal use only.

- To add a custom validation, we add a key value pair to the options object passed into the register function. The key is called validate and it is going to be a function. The function automatically receives field values as an argument. Within the function you can add one or more conditions and return true if the validation passes or return a string message if the validation fails.

validate: (fieldValue) => {
return (
fieldValue !== "admin@example.com" ||
"Enter a different email address"
);
}

- validate can also be objects with multiple key value pairs.
  as key we specify a name for the validation rule

  validate: {
  notAdmin: (fieldValue) => {
  return (
  fieldValue !== "admin@example.com" ||
  "Enter a different email address"
  );
  },
  },
  Since we have an object, now we can add another validation rule.

  notBlackListed: (fieldValue) => {
  return (
  !fieldValue.endsWith("baddomain.com") ||
  "This domain is not supported"
  );
  },

  5. Additional Features:
     \*\* Let's set default values to our form fields:

  - useForm hook accepts an object as an argument, inside this object, we can specify a key called default values, which is also an object. We add key value pairs to this object where the key represents the field name and the value is the default value you want to set.
  - Here we have set initial values to be empty.
  - Now doing this does not change anything except for the fact that we don't need to specify the form values type when invoking useForm hook. Typescript does not throw error.

  const form = useForm<FormValues>({
  defaultValues: {
  username: "",
  email: "",
  channel: "",
  },
  }
  Here we can remove that FormValues.

  - To load previously saved data as default values: We change default values to an async function.

  defaultValues: async () => {
  const response = await fetch(
  "https://jsonplaceholder.typicode.com/users/1"
  );
  const data = await response.json();
  return {
  username: "Batman",
  email: data.email,
  channel: "",
  };
  },

  \*\*Working with Nested Objects in react hook form:

- For example we want our youtube form to collect information about the user's social media profiles such as twitter and facebook. As the two fields are related, we want them to be grouped and stored as a nested object.

1. Add social to FormValues type
2. On the default values object, add a new key value pair.
3. Add JSX for twitter and facebook
   <label htmlFor="twitter">Twitter</label>
   <input type="text" id="twitter" {...register("social.twitter")} />

- Make sure to use don notation in register argument

\*\* Managing form control values as an array

- For example if you want to collect user's primary and secondary phone number in an array under the same label

1.  Add phoneNumbers to FormValues type => string[]
2.  On the default values object, add the property
3.  Add the JSX

<label htmlFor="primary-phone">Primary Phone Number</label>
<input type="text" id="primary-phone" {...register("phoneNumbers.0")} />
// Here we can not use phoneNumbers[0]
output will be in this format: phoneNumbers:['123456', '789456']

\*\* Dynamic Fields: Gives user the option to add or remove fields based on their needs

1. import hook useFieldArray
2. Add a new property to FormValues types, useFieldArray works only with object values, so here we have taken array of objects

phNumbers: {
numbers: string;
}[];

3.  On the default values object, add the property
4.  We need to specify the phone numbers fields as an array of fields, for that we invoke useField array, pass an object as an argument
5.  useFieldArray then return an array of fields which we can use in JSX.

const { fields } = useFieldArray({
name: "phNumbers",
control, // this is control returned by useForm hook
});

6. destructure useFieldArray to get append and remove
7. map over fields array
8. Now we are going to add buttons to add and remove phone numbers field. => add a button, with a text, Add Phone Number, for the onclick handler, we use the function called append, call append and pass the object with number set to empty string:

<button type="button" onClick={() => append({ number: "" })}>Add Phone Number</button> => This will add a new entry in our phNumbers array

Similarly for remove button, here we will call remove function.
{index > 0 && <button type="button" onClick={() => remove(index)}>Remove Phone Number</button>}

// React hook form recommends field.id and not the index for
correct behaviour

\*\*Numeric and Date Values:

- Let's add an age field to our form

<label htmlFor="age">Age</label>
<input type="number" id="age" {...register("age", {
valueAsNumber: true,
required: {
value: true,
message: "Age is required",
},
})}

// For age to be in number, we use valueAsNumber:true, otherwise it will shown in string in console
// Same in the case of date, we use valueAsDate: true, so that date can be in proper Date Format

\*\* Watch Field Values: We can observe one or more field values

1. From the form object. destructure watch
2. call the watch function and pass in the field name as argument and store the result in a constant
3. We can render this value in the UI =>

const watchUserName = watch("username");

<h2>Watched Values: {watchUserName}</h2>

- Now whatever we type in username, value will be displayed back to us.
  // watch also accepts array of names to watch. const watchUserName = watch(["username", "email"]);

// if you don't pass any argument in watch function, the entire form is being watched for changes in values

\*\* Get Field Values:Another method to read values, Unlike watch, getValues will not trigger re-renders or subscribe to input changes, making it better option for getting form values when a user clicks on a button or performs a specific action.

1. Destructure from the form object
2. <button type="button" onClick={handleGetValues}>Get Values</button>
3. const handleGetValues = () => console.log("GET VALUES:", getValues());

- Now the form values will be logged in the console.
  // Note that changing a field value will not trigger the getValues method.
- In addition to retrieving all field values, we can also retrieve specific field values by passing in the field name or an array of field names as argument to the getValues method.

const handleGetValues = () => console.log("GET VALUES:", getValues("social"));

\*\* Set Field Values:

1. destructure setValue from form object. This method allows us to set the value of a registered field
2. <button type="button" onClick={handleSetValues}>Set Values</button>
3. const handleSetValues = () => setValue("username", "");
   // First argument is field name and second argument is the new field value
   // For eg: set the username field to an empty string

- Default value of Batman was set to username, but now when you click on set value button, it will become an empty string
