import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
    return {
        keyArgs: false, // tells Apollo we will take care of everything.
        read(existing = [], { args, cache }) {
            console.log({ existing, args, cache });
            const { skip, first } = args;
            // first, ask the read fn for those items.
            const data = cache.readQuery({ query: PAGINATION_QUERY });
            console.log(data);
            const count = data?._allProductsMeta?.count;
            const page = skip / first + 1;
            const pages = Math.ceil(count / first);

            // check if we have existing items
            const items = existing
                .slice(skip, skip + first)
                .filter((item) => item);

            // if:
            // there are items
            // AND there are not enough items to satisfy how many were requested
            // AND we are on the last page
            // THEN just send it.
            if (items.length && items.length !== first && page === pages) {
                return items;
            }

            if (items.length !== first) {
                // we don't have any items - we must go to the network to fetch them.

                return false; // fallback to network
            }
            // if there are items, just return them from the cache, and we do not
            // need to go to the network.

            if (items.length) {
                console.log(
                    `There are ${items.length} items in the cache! Gonna send them to apollo.`
                );
                return items;
            }
            // we can do one of two things:
            // 1. return the items because they are already in the cache
            // 2. return false from here (network request)
        },
        merge(existing, incoming, { args }) {
            // this runs when the Apollo client comes back from the network with our products
            console.log(`Merging items from the network ${incoming.length}`);
            const { skip, first } = args;
            const merged = existing ? existing.slice(0) : [];
            // eslint-disable-next-line no-plusplus
            for (let i = skip; i < skip + incoming.length; ++i) {
                merged[i] = incoming[i - skip];
            }
            console.log({ merged });
            // finally we return the merged items from the cache.
            // it goes back to the read method and invokes it again. (read => merge => read)
            return merged;
        },
    };
}
