import Head from 'next/head';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import DisplayError from './ErrorMessage';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

export const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        _allProductsMeta {
            count
        }
    }
`;

interface PaginationProps {
    page: number;
}

export default function Pagination({ page }: PaginationProps) {
    const { error, loading, data } = useQuery(PAGINATION_QUERY);

    if (loading) return <p>Loading....</p>;
    if (error) return <DisplayError error={error} />;

    const { count } = data?._allProductsMeta;
    const pageCount = Math.ceil(count / perPage);
    return (
        <PaginationStyles>
            <Head>
                <title>
                    Sick Fits - Page {page} of {pageCount}
                </title>
            </Head>
            <Link href={`/products/${page - 1}`}>
                <a aria-disabled={page <= 1}>← Prev</a>
            </Link>
            <p>
                Page {page} of {pageCount}
            </p>
            <p>{count} Items Total</p>
            <Link href={`/products/${page + 1}`}>
                <a aria-disabled={page >= pageCount}>Next →</a>
            </Link>
        </PaginationStyles>
    );
}
