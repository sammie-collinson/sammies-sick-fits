import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();

const LocalStateProvider = LocalStateContext.Provider;

// eslint-disable-next-line react/prop-types
function CartStateProvider({ children }) {
    // this is our own custom provider.
    // we will store data (state) and functionality (updaters) in here.
    // anyone will be able to access it via the consumer.

    const [cartOpen, setCartOpen] = useState(false);

    function toggleCart() {
        setCartOpen(!cartOpen);
    }

    function closeCart() {
        setCartOpen(false);
    }

    function openCart() {
        setCartOpen(true);
    }

    return (
        <LocalStateProvider
            value={{ cartOpen, setCartOpen, toggleCart, closeCart, openCart }}
        >
            {children}
        </LocalStateProvider>
    );
}

// custom hook for access cart local state

function useCart() {
    // we use a consumer here to access the local state
    const all = useContext(LocalStateContext);
    return all;
}

export { CartStateProvider, useCart };
