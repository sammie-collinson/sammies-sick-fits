import { gql, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import React, { FormEvent } from "react";
import Form from "./styles/Form";
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from "./User";

const SignInFormik = () => {
    const formik = useFormik<{email: string, password: string}>({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: values => console.log(values)
    });
    const [signin, { data }] = useMutation(SIGNIN_MUTATION, {
        variables: formik.values,
        // refetch the currently logged in user
        refetchQueries: [{ query: CURRENT_USER_QUERY }],
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // send email, password, and name to gql api
        await signin();
        formik.resetForm();
    };

    const error =
    data?.authenticateUserWithPassword.__typename ===
    'UserAuthenticationWithPasswordFailure'
        ? data?.authenticateUserWithPassword
        : undefined;
return (
    <Form onSubmit={handleSubmit} method="POST">
        <Error error={error} />
        <h2>Sign Into Your Account</h2>
        <fieldset disabled={false} aria-busy="false">
            <label htmlFor="email">
                Email
                <input
                    type="text"
                    id="signInEmail"
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
                    id="signInPassword"
                    name="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                />
            </label>

            <button type="submit">Sign In</button>
        </fieldset>
    </Form>
);
}

const SIGNIN_MUTATION = gql`
    mutation SIGN_IN_MUTATION($email: String!, $password: String!) {
        authenticateUserWithPassword(email: $email, password: $password) {
            ... on UserAuthenticationWithPasswordSuccess {
                item {
                    email
                    name
                    password_is_set
                }
            }
            ... on UserAuthenticationWithPasswordFailure {
                code
                message
            }
        }
    }
`;
export default SignInFormik;