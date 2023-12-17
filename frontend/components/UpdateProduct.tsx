import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { useFormik } from 'formik';
import { useEffect } from 'react';

interface UpdateProductProps {
    id: string;
}

export default function UpdateProduct({ id }: UpdateProductProps) {
    
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
        { error: updateError, loading: updateLoading },
    ] = useMutation(UPDATE_PRODUCT_MUTATION);
    
    // 2.5 create some state for form inputs, and update the form with query values once they are available
    useEffect(() => {
        if(productData && productData.Product){
            formik.setValues(productData.Product);
        }
    }, [productData]);
   

    const formik = useFormik<{id: string, name: string, description: string, price: number}>({
        initialValues: {id, name: '', description: '', price: 0},
        onSubmit: async (values) => {
            await updateProduct({variables: values})
        }
    })

    const error = productError || updateError;
    const loading = productLoading || updateLoading;

    if (loading) return <p>Loading....</p>;
    return (
        <Form onSubmit={formik.handleSubmit}>
            <DisplayError error={error} />
            <fieldset disabled={updateLoading} aria-busy={updateLoading}>
                <label htmlFor="name">
                    Name
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                </label>
                <label htmlFor="price">
                    Price
                    <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                    />
                </label>
                <label htmlFor="description">
                    Description
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                </label>
                <button type="submit">Update Product</button>
            </fieldset>
        </Form>
    );
}

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
