import { useForm, useFieldArray } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

const YouTubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: "Batman",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date(),
    },
  });
  // To help manage form state, react hook provides a method called register that can be accessed on the form object.
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
  } = form;
  const { errors } = formState;
  // This method allows us to register a from control with react hook form.
  // We can call this method, passing in a string argument, To register the username field, we pass in username as string.

  // This method in turn returns four methods that we need to hook into the form control, The four methods are: name, ref, onChange, onBlur.

  // const {name, ref, onChange, onBlur} = register("username");

  // To simplify registering a field with react hook form, we can directly spread the register method on the form control.

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control, // this is control returned by useForm hook
  });

  type FormValues = {
    username: string;
    email: string;
    channel: string;
    social: {
      twitter: string;
      facebook: string;
    };
    phoneNumbers: string[];
    phNumbers: {
      number: string;
    }[];
    age: number;
    dob: Date;
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted", data);
  };

  const watchUserName = watch();

  const handleGetValues = () => {
    console.log("GET VALUES:", getValues("social"));
  };

  const handleSetValues = () => {
    setValue("username", "");
    // First argument is field name and second argument is the new field value
    // For eg: set the username field to an empty string
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* <h2>Watched Values: {JSON.stringify(watchUserName)}</h2> */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          {...register("username", {
            required: "Username is required",
          })}
        />
        {/* In the place of name="username", we will use register method */}
        <p>{errors.username?.message}</p>

        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          {...register("email", {
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
              message: "Invalid Email Format",
            },
            validate: {
              notAdmin: (fieldValue) => {
                return (
                  fieldValue !== "admin@example.com" ||
                  "Enter a different email address"
                );
              },
              notBlackListed: (fieldValue) => {
                return (
                  !fieldValue.endsWith("baddomain.com") ||
                  "This domain is not supported"
                );
              },
            },
          })}
        />
        <p>{errors.email?.message}</p>

        <label htmlFor="channel">Channel</label>
        <input type="text" id="channel" {...register("channel")} />
        <p>{errors.channel?.message}</p>

        <label htmlFor="twitter">Twitter</label>
        <input type="text" id="twitter" {...register("social.twitter")} />

        <label htmlFor="facebook">Facebook</label>
        <input type="text" id="facebook" {...register("social.facebook")} />

        <label htmlFor="primary-phone">Primary Phone Number</label>
        <input type="text" id="primary-phone" {...register("phoneNumbers.0")} />

        <label htmlFor="secondary-phone">Secondary Phone Number</label>
        <input
          type="text"
          id="secondary-phone"
          {...register("phoneNumbers.1")}
        />
        <div>
          <label>List Of Phone Numbers</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => remove(index)}>
                      Remove Phone Number
                    </button>
                  )}
                </div>
              );
            })}
            <button type="button" onClick={() => append({ number: "" })}>
              Add Phone Number
            </button>
          </div>
        </div>

        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          {...register("age", {
            valueAsNumber: true,
            required: {
              value: true,
              message: "Age is required",
            },
          })}
        />

        <label htmlFor="dob">DOB</label>
        <input
          type="date"
          id="dob"
          {...register("dob", {
            valueAsDate: true,
          })}
        />

        <button>Submit</button>
        <button type="button" onClick={handleGetValues}>
          Get Values
        </button>

        <button type="button" onClick={handleSetValues}>
          Set Values
        </button>
      </form>
      {/* Invoke the DevTool component after the closing form tag */}
      {/* On the DevTool component, we specify a control prop and assign the control object as value. */}
      {/* Here we are basically tieing together our form and DevTools */}
      <DevTool control={control} />
    </div>
  );
};

export default YouTubeForm;
