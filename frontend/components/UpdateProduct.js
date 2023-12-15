/* eslint-disable react/prop-types */
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import useForm from '../lib/useForm';

const SINGLE_PRODUCT_QUERY = gql`
    query SINGLE_PRODUCT_QUERY($id: ID!) {
        Product(where: { id: $id }) {
            id
            name
            description
            price
        }
    }
`;

const UPDATE_PRODUCT_MUTATION = gql`
    mutation UPDATE_PRODUCT_MUTATION(
        $id: ID!
        $name: String
        $description: String
        $price: Int
    ) {
        updateProduct(
            id: $id
            data: { name: $name, description: $description, price: $price }
        ) {
            id
            name
            description
            price
        }
    }
`;

export default function UpdateProduct({ id }) {
    // 1. get existing product
    const {
        data: productData,
        loading: productLoading,
        error: productError,
    } = useQuery(SINGLE_PRODUCT_QUERY, {
        variables: { id },
    });

    // 2. get the mutation to update the product
    const [
        updateProduct,
        { data: updateData, error: updateError, loading: updateLoading },
    ] = useMutation(UPDATE_PRODUCT_MUTATION);

    // 2.5 create some state for form inputs:
    const { inputs, handleChange, clearForm, resetForm } = useForm(
        productData?.Product
    );

    // 3. need the form to handle the updates

    const error = productError || updateError;
    const loading = productLoading || updateLoading;

    if (loading) return <p>Loading....</p>;
    return (
        <Form
            onSubmit={async (e) => {
                e.preventDefault();
                const res = await updateProduct({
                    variables: {
                        id,
                        name: inputs.name,
                        description: inputs.description,
                        price: inputs.price,
                    },
                });
            }}
        >
            <DisplayError error={error} />
            <fieldset disabled={updateLoading} aria-busy={updateLoading}>
                <label htmlFor="name">
                    Name
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={inputs.name}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="price">
                    Price
                    <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        value={inputs.price}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="description">
                    Description
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        value={inputs.description}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Update Product</button>
            </fieldset>
        </Form>
    );
}
