import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import DisplayError from './ErrorMessage';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import { ALL_PRODUCTS_QUERY } from './Products';

// TODO: side project, implement Formik

const CREATE_PRODUCT_MUTATION = gql`
    mutation CREATE_PRODUCT_MUTATION(
        # Which variables are getting passed in? What types are they?
        $name: String!
        $description: String!
        $price: Int!
        $image: Upload
    ) {
        createProduct(
            data: {
                name: $name
                description: $description
                price: $price
                status: "Available"
                photo: { create: { image: $image, altText: $name } }
            }
        ) {
            id
            price
            description
            name
        }
    }
`;

export default function CreateProduct() {
    const { inputs, handleChange, clearForm, resetForm } = useForm({
        image: '',
        name: 'Nice Shoes',
        price: 3300,
        description: 'These are the best shoes!',
    });

    const [createProduct, { data, loading, error }] = useMutation(
        CREATE_PRODUCT_MUTATION,
        {
            variables: inputs,
            // refetchQueries allows the homepage/products page to update with the newly added products
            // without requiring an actual browser refresh.
            refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
        }
    );

    return (
        <Form
            onSubmit={async (e) => {
                e.preventDefault();
                // you can pass in the inputs in the mutation if you  know them ahead of time, or you can pass them in this
                // invocation as well.
                const res = await createProduct();
                clearForm();
                // Go to that product's page
                Router.push({
                    pathname: `/product/${res.data.createProduct.id}`,
                });
            }}
        >
            <DisplayError error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
                <label htmlFor="image">
                    Image
                    <input
                        required
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleChange}
                    />
                </label>
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
                <button type="submit">+ Add Product</button>
            </fieldset>
        </Form>
    );
}
