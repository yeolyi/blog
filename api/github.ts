import { Octokit } from 'octokit';

let customFetch: typeof fetch = (resource, options) =>
  fetch(resource, { ...options, next: { revalidate: 3 } });

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

export let logRateLimit = async () => {
  console.log(
    await octokit.request('GET /rate_limit', {
      owner: 'yeolyi',
      repo: 'blog',
    }),
  );
};
