import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  // 1. query current user, see if they are signed in

  const session = context.session as Session;
  if (!session.itemId) {
    throw new Error('you must be logged in to do this');
  }
  // 2. query current user's cart

  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: session.itemId }, product: { id: productId } },
    resolveFields: 'id, quantity',
  });

  // 3. check if current item is already in the cart
  // 4. if yes, increment by 1,
  const [existingCartItem] = allCartItems;

  if (existingCartItem) {
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: {
        quantity: existingCartItem.quantity + 1,
      },
    });
  }
  // 4. if no, create a new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: {
        connect: { id: productId },
      },
      user: {
        connect: { id: session.itemId },
      },
    },
  });
}
