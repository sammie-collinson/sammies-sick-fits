import UpdateProduct from "../components/UpdateProduct";

interface UpdatePageProps {
  query: Record<string, any>;
}

export default function UpdatePage({ query }: UpdatePageProps) {
  return (
    <div>
      <UpdateProduct id={query.id} />
    </div>
  );
}
