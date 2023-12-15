/* eslint-disable react/prop-types */
import RequestPasswordReset from '../components/RequestReset';
import Reset from '../components/Reset';

export default function ResetPage({ query }) {
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
