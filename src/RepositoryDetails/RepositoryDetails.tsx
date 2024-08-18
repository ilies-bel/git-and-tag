import {axiosInstance} from "../AxiosInstance.tsx";
import {Link, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import CommitCalendar from "./CommitCalendar.tsx";

const fetchRepoDetail = async (owner, repoName) => {
    const response = await axiosInstance.get(`/repos/${owner}/${repoName}`);
    return response.data;
};

// Function to fetch repository events (activity history)
const fetchRepoEvents = async (owner, repoName) => {
    const response = await axiosInstance.get(`/repos/${owner}/${repoName}/events`);
    return response.data;
};
const RepoDetail = () => {
    const { owner, repoName } = useParams();

    const { data: repo, error, isLoading } = useQuery({
        queryKey: ['repoDetail', owner, repoName],
        queryFn: () => fetchRepoDetail(owner, repoName),
    });

    // Fetch the repository events
    const { data: events, error: eventsError, isLoading: eventsLoading } = useQuery({
        queryKey: ['repoEvents', owner, repoName],
        queryFn: () => fetchRepoEvents(owner, repoName),
    });


    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    // Filter events to show only the current user's activity
    const currentUser = Config.repoUser;
    const commitEvents = events.filter(
        (event) => event.type === 'PushEvent' && event.actor.login === currentUser
    );
    return (
        <div>
            <h1>{repo.name}</h1>
            <p>Description: {repo.description}</p>

            <CommitCalendar commitEvents={commitEvents} currentUser={currentUser}/>

            <p>Stars: {repo.stargazers_count}</p>
            <p>Forks: {repo.forks_count}</p>
            <p>Language: {repo.language}</p>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                View on GitHub
            </a>
            <br />
            <Link to="/">Back to Repositories List</Link>

            <h2>Activity History for {currentUser}</h2>
            <ul>
                {commitEvents.length > 0 ? (
                    commitEvents.map((event) => (
                        <li key={event.id}>
                            <p>
                                <strong>Event Type:</strong> {event.type}
                            </p>
                            <p>
                                <strong>Date:</strong> {new Date(event.created_at).toLocaleString()}
                            </p>
                            <p>
                                <strong>Action:</strong> {event.payload.action || 'N/A'}
                            </p>
                            {event.payload.commits && (
                                <div>
                                    <strong>Commits:</strong>
                                    <ul>
                                        {event.payload.commits.map((commit) => (
                                            <li key={commit.sha}>
                                                <p>{commit.message}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    <p>No recent activity for this repository by {currentUser}.</p>
                )}
            </ul>
        </div>
    );
};

export default RepoDetail;