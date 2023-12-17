import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { CURRENT_USER_QUERY } from './User';
import { useCart } from '../lib/cartState';

const AddToCart = ({ id }: { id: string }) => {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION);

  const { openCart } = useCart();

  const handleClick = async () => {
    await addToCart({
      variables: { id },
      refetchQueries: [{ query: CURRENT_USER_QUERY }]
    });
    openCart();
  };

  return (
    <button type="button" disabled={loading} onClick={handleClick}>
      Add{loading && 'ing'} to Cart 🛒
    </button>
  );
};

export default AddToCart;

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;
