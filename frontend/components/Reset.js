/* eslint-disable react/prop-types */
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import Error from './ErrorMessage';
import useForm from '../lib/useForm';

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

export default function Reset({ token }) {
    const { inputs, handleChange, resetForm } = useForm({
        email: '',
        password: '',
        token,
    });

    const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
        variables: inputs,
    });
    const tokenError = data?.redeemUserPasswordResetToken?.code
        ? data?.redeemUserPasswordResetToken
        : undefined;

    const handleSubmit = async (e) => {
        e.preventDefault();
        // send email, password, and name to gql api
        await reset().catch(console.error);
        resetForm();
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
                        value={inputs.email}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={inputs.password}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit">Request Password Reset</button>
            </fieldset>
        </Form>
    );
}
