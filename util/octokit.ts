import { Octokit, App } from 'octokit';

let customFetch: typeof fetch = (resource, options) =>
  fetch(resource, { ...options, next: { revalidate: 10 } });

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  request: { fetch: customFetch },
});

export let getStarGazers = async (): Promise<number> => {
  let resp = await octokit.request('GET /repos/{owner}/{repo}/', {
    owner: 'yeolyi',
    repo: 'blog',
  });
  return resp.data.stargazers_count;
};
