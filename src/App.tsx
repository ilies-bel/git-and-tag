import {RepoList} from "./RepoList.tsx";
import {Route, Routes} from "react-router-dom";
import RepoDetail from "./RepositoryDetails/RepositoryDetails.tsx";


export default function App() {
    return (
        <Routes>
            <Route path="/" element={<RepoList />} />
            <Route path="/repo/:owner/:repoName" element={<RepoDetail />} />
        </Routes>
    );
}

