import { useRouter } from 'next/dist/client/router';
import Pagination from '../../components/Pagination';
import Products from '../../components/Products';

export default function ProductsPage() {
    const { query } = useRouter();
    const getPageNumber = () => {
        if(!query.page) return 1;
        if(typeof query.page === 'string'){
            return parseInt(query.page)
        }
        return parseInt(query.page[0])
    }
     

    return (
        <div>
            <Pagination page={getPageNumber()} />
            <Products page={getPageNumber()} />
            <Pagination page={getPageNumber()} />
        </div>
    );
}
