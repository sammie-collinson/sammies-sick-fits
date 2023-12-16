import RequestPasswordReset from '../components/RequestReset';
import Reset from '../components/Reset';

// note: will not be using in prod.

interface ResetPageProps {
    query: Record<string, any>;
}

export default function ResetPage({ query }: ResetPageProps) {
    if (!query?.token)
        return (
            <div>
                <p>Sorry, you must supply a token</p>
                <RequestPasswordReset />
            </div>
        );
    return (
        <div>
            <Reset token={query.token} />
        </div>
    );
}
