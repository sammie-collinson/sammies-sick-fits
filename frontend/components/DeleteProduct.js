/* eslint-disable react/prop-types */

import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const DELETE_PRODUCT_MUTATION = gql`
    mutation DELETE_PRODUCT_MUTATION($id: ID!) {
        deleteProduct(id: $id) {
            id
            name
        }
    }
`;

function update(cache, payload) {
    // apollo has a nice evict api, which will remove the item from the payload from the cache
    // so that the UI updates instantly once the product is deleted.
    cache.evict(cache.identify(payload.data.deleteProduct));
}

export default function DeleteProduct({ id, children }) {
    const [deleteProduct, { loading, error }] = useMutation(
        DELETE_PRODUCT_MUTATION,
        {
            variables: {
                id,
            },
            // update runs when the mutation returns
            update,
        }
    );

    return (
        <button
            type="button"
            disabled={loading}
            onClick={async () => {
                // eslint-disable-next-line no-restricted-globals
                if (confirm('Are you sure you want to delete this item?')) {
                    console.log('deleting');
                    await deleteProduct().catch((err) => alert(err.message));
                }
            }}
        >
            {children}
        </button>
    );
}
