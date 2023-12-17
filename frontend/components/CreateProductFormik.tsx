import { useMutation } from "@apollo/client";
import {  useFormik } from "formik";
import gql from "graphql-tag";
import Router from 'next/router';
import React from "react";
import Form from './styles/Form';
import DisplayError from "./ErrorMessage";
import { ALL_PRODUCTS_QUERY } from "./Products";


const CreateProductFormik = () => {
    const [createProduct, { loading, error }] = useMutation(
        CREATE_PRODUCT_MUTATION );

    const formik = useFormik<{image?: File, name: string, price: number, description: string}>({
        initialValues: {
            image: undefined,
            name: 'Product Name',
            price: 0,
            description: 'Input product description here'

        },
        onSubmit: async (values) => {
            const res = await createProduct({
                variables: values,
                refetchQueries: [{query: ALL_PRODUCTS_QUERY}]
            })
              // Go to that product's page
              Router.push({
                pathname: `/product/${res.data.createProduct.id}`,
            });
        },
        
    });
    
        
    return (
        <Form onSubmit={formik.handleSubmit}>
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