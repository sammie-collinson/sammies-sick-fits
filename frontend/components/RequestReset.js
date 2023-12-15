import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import Error from './ErrorMessage';
import useForm from '../lib/useForm';

const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION($email: String!) {
        sendUserPasswordResetLink(email: $email) {
            code
            message
        }
    }
`;

export default function RequestPasswordReset() {
    const { inputs, handleChange, resetForm } = useForm({
        email: '',
    });

    const [signup, { data, error, loading }] = useMutation(
        REQUEST_RESET_MUTATION,
        {
            variables: inputs,
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        // send email, password, and name to gql api
        await signup();
        resetForm();
    };

    return (
        <Form onSubmit={handleSubmit} method="POST">
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
                        value={inputs.email}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit">Request Password Reset</button>
            </fieldset>
        </Form>
    );
}
