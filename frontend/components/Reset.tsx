/* eslint-disable react/prop-types */
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { useFormik } from 'formik';
import { FormEvent } from 'react';

// TODO: remove this component since I don't want to use it in prod


interface ResetProps {
    token: string;
}

export default function Reset({ token }: ResetProps) {

    const formik = useFormik<{email: string, password: string, token: string}>({
        initialValues: {
            email: '',
            password: '',
            token,
        },
        onSubmit: values => console.log(values)
    });

    const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
        variables: formik.values,
    });
    const tokenError = data?.redeemUserPasswordResetToken?.code
        ? data?.redeemUserPasswordResetToken
        : undefined;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // send email, password, and name to gql api
        await reset().catch(console.error);
        formik.resetForm();
    };

    return (
        <Form onSubmit={handleSubmit} method="POST">
            <Error error={error || tokenError} />
            <h2>Reset Your Password</h2>
            <fieldset disabled={loading} aria-busy={loading}>
                {data?.redeemUserPasswordResetToken === null && (
                    <p>Success! You can now sign in.</p>
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
                <label htmlFor="password">
                    Password
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                </label>

                <button type="submit">Request Password Reset</button>
            </fieldset>
        </Form>
    );
}

const RESET_MUTATION = gql`
    mutation RESET_MUTATION(
        $email: String!
        $password: String!
        $token: String!
    ) {
        redeemUserPasswordResetToken(
            email: $email
            password: $password
            token: $token
        ) {
            code
            message
        }
    }
`;

