import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        Authorization: `token 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`,  // Replace with your GitHub token
    },
});