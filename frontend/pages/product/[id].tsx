import SingleProduct from '../../components/SingleProduct';

interface SingleProductPageProps {
  query: Record<string, any>;
}

export default function SingleProductPage({ query }: SingleProductPageProps) {
  return <SingleProduct id={query.id} />;
}
