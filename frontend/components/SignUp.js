import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import Error from './ErrorMessage';
import useForm from '../lib/useForm';

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

export default function SignUp() {
    const { inputs, handleChange, resetForm } = useForm({
        email: '',
        name: '',
        password: '',
    });

    const [signup, { data, error, loading }] = useMutation(SIGNUP_MUTATION, {
        variables: inputs,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // send email, password, and name to gql api
        await signup();
        resetForm();
    };

    return (
        <Form onSubmit={handleSubmit} method="POST">
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
                        value={inputs.name}
                        onChange={handleChange}
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
                        value={inputs.email}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input
                        type="password"
                        id="signUpPassword"
                        name="password"
                        placeholder="Password"
                        value={inputs.password}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit">Sign In</button>
            </fieldset>
        </Form>
    );
}
