import { gql, useQuery } from '@apollo/client';
import { CartItem } from './Cart';

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    authenticatedItem {
      ... on User {
        name
        id
        email
        cart {
          id
          quantity
          product {
            id
            price
            photo {
              image {
                publicUrlTransformed
              }
            }
            name
            description
          }
        }
      }
    }
  }
`;

interface AuthenticatedItem {
  cart: CartItem[];
  email: string;
  id: string;
  name: string;
}

export function useUser(): AuthenticatedItem | undefined {
  const { data } = useQuery(CURRENT_USER_QUERY);
  return data?.authenticatedItem;
}
