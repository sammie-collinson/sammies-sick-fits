import { resetIdCounter, useCombobox } from 'downshift';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { useLazyQuery } from '@apollo/client';
import { ProductType } from './Product';
import { useRouter } from 'next/router';

const Search = () => {
  const router = useRouter();
  const [findItems, { loading, data }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    // we do not want to cache or store any of these results.
    // we always want to go directly to the network
    {
      fetchPolicy: 'no-cache'
    }
  );

  const items: ProductType[] = data?.searchTerms || [];

  // do not run a network request more than once every 350ms
  const findItemsButInAWayThatDoesNotSendAMillionNetworkRequests = debounce(
    findItems,
    350
  );

  resetIdCounter();
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    inputValue,
    getItemProps,
    highlightedIndex
  } = useCombobox({
    items: items,
    onInputValueChange() {
      findItemsButInAWayThatDoesNotSendAMillionNetworkRequests({
        variables: { searchTerm: inputValue }
      });
    },
    onSelectedItemChange({ selectedItem }) {
      if (selectedItem) {
        router.push({
          pathname: `/product/${selectedItem.id}`
        });
      }
    },
    itemToString: (item) => item?.name || ''
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an item',
            id: 'search',
            className: loading ? 'loading' : undefined
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item: ProductType, index: number) => (
            <DropDownItem
              key={item.id}
              {...getItemProps({ item })}
              highlighted={index === highlightedIndex}
            >
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
                width="50"
              />
              {item.name}
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem>Sorry, no items found for {inputValue}</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
};

export default Search;

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    searchTerms: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      price
      description
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;
