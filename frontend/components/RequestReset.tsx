import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import Form from "./styles/Form";
import Error from "./ErrorMessage";

// note: I did not feel like signing up for a transactional email handler,
// so this component will not be used in prod.

export default function RequestPasswordReset() {
  const [signup, { data, error, loading }] = useMutation(
    REQUEST_RESET_MUTATION
  );

  const formik = useFormik<{ email: string }>({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      await signup({ variables: values });
      formik.resetForm();
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} method="POST">
      <Error error={error} />
      <h2>Request a Password Reset</h2>
      <fieldset disabled={loading} aria-busy={loading}>
        {data?.sendUserPasswordResetLink === null && (
          <p>Success! Check you email for a link.</p>
        )}

        <label htmlFor="email">
          Email
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Your email address"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </label>

        <button type="submit">Request Password Reset</button>
      </fieldset>
    </Form>
  );
}

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;
