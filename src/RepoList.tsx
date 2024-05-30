// Function to fetch public repositories
import {axiosInstance} from "./AxiosInstance.tsx";
import {useQuery} from "@tanstack/react-query";
import {Link} from "react-router-dom";

const fetchRepos = async () => {
    const response = await axiosInstance.get('/user/repos');
    // Only return public repos
    return response.data;
};

export function RepoList() {
    // Use the `useQuery` hook to fetch the data
    const {data: repos, error, isLoading} = useQuery({
        queryKey: ['repos'],
        queryFn: fetchRepos,
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div >
            <h1>My Repositories</h1>
            <ul>
                {repos.map((repo) => (
                    <li key={repo.id}>
                        {/* Link to the repo detail page */}
                        <Link to={`/repo/${repo.owner.login}/${repo.name}`}>
                            {repo.name}
                        </Link>
                    </li>

                ))}
            </ul>
        </div>
    );
}