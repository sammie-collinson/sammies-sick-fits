import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { ReactChildren } from "react";

interface DeleteProductProps {
  id: string;
  children: ReactChildren;
}

// TS note - need to research how to narrow the types of these arguments for the update function.
function update(cache: any, payload: any) {
  // apollo has a nice evict api, which will remove the item from the payload from the cache
  // so that the UI updates instantly once the product is deleted.
  cache.evict({ id: cache.identify(payload.data.deleteProduct) });
}

export default function DeleteProduct({ id, children }: DeleteProductProps) {
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
        if (confirm("Are you sure you want to delete this item?")) {
          await deleteProduct().catch((err) => alert(err.message));
        }
      }}
    >
      {children}
    </button>
  );
}

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;
