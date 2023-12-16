import { useMutation } from "@apollo/client";
import {  useFormik } from "formik";
import gql from "graphql-tag";
import Router from 'next/router';
import React, { useCallback } from "react";
import Form from './styles/Form';
import DisplayError from "./ErrorMessage";
import { ALL_PRODUCTS_QUERY } from "./Products";


const CreateProductFormik = () => {

    const formik = useFormik<{image?: File, name: string, price: number, description: string}>({
        initialValues: {
            image: undefined,
            name: 'Product Name',
            price: 0,
            description: 'Input product description here'

        },
        onSubmit: values => console.log(values),
        
    });
    
    const [createProduct, { data, loading, error }] = useMutation(
        CREATE_PRODUCT_MUTATION,
        {
            variables: formik.values,
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
                formik.resetForm();
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
                        onChange={(e) => {
                            if(e.currentTarget.files){
                                formik.setFieldValue("image", e.currentTarget.files[0])
                            }
                        }}
                    />
                </label>
                <label htmlFor="name">
                    Name
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={formik.values.name}
                        onChange={(formik.handleChange)}
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
                <button type="submit">+ Add Product</button>
            </fieldset>
        </Form>
    );
}

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


export default CreateProductFormik;