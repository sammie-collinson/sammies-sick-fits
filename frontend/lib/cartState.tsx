import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

interface CartContext {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

interface Props {
  children: ReactNode;
}

const LocalStateContext = createContext<CartContext | null>(null);

const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }: Props) {
  // this is our own custom provider.
  // we will store data (state) and functionality (updaters) in here.
  // anyone will be able to access it via the consumer.

  const [cartOpen, setCartOpen] = useState(false);

  const toggleCart = useCallback(() => {
    setCartOpen(!cartOpen);
  }, []);

  const closeCart = useCallback(() => {
    setCartOpen(false);
  }, []);

  const openCart = useCallback(() => {
    setCartOpen(true);
  }, []);

  const ctxValue = useMemo(
    () => ({
      cartOpen,
      openCart,
      closeCart,
      toggleCart
    }),
    [cartOpen, openCart, closeCart, toggleCart]
  );

  return <LocalStateProvider value={ctxValue}>{children}</LocalStateProvider>;
}

// custom hook for access cart local state

function useCart() {
  // we use a consumer here to access the local state
  const all = useContext(LocalStateContext);
  return all;
}

export { CartStateProvider, useCart };
