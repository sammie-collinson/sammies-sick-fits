import React, { FormEvent } from "react";
import { useFormik } from "formik";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from './ErrorMessage'
import { useMutation } from "@apollo/client";



const SignUpFormik = () => {
    const formik = useFormik<{email: string; name: string; password: string;}>({
        initialValues: {
            email: '',
            name: '',
            password: '',
        },
        onSubmit: values => console.log(values)
    });
    const [signup, { data, error, loading }] = useMutation(SIGNUP_MUTATION, {
        variables: formik.values,
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // send email, password, and name to gql api
        await signup();
        formik.resetForm();
    };

      return (
        <Form onSubmit={(e) => handleSubmit(e)} method="POST">
            <Error error={error} />
            <h2>Sign Up for an Account</h2>
            <fieldset disabled={loading} aria-busy={loading}>
                {data?.createUser && (
                    <p>
                        Signed up with {data.createUser.email}. Please go ahead
                        and sign in.
                    </p>
                )}
                <label htmlFor="name">
                    Your Name
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        autoComplete="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                </label>
                <label htmlFor="email">
                    Email
                    <input
                        type="text"
                        id="signUpEmail"
                        name="email"
                        placeholder="Your email address"
                        autoComplete="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input
                        type="password"
                        id="signUpPassword"
                        name="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                </label>

                <button type="submit">Sign In</button>
            </fieldset>
        </Form>

      )
}

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION(
        $name: String!
        $email: String!
        $password: String!
    ) {
        createUser(data: { name: $name, email: $email, password: $password }) {
            id
            name
            email
        }
    }
`;

export default SignUpFormik;