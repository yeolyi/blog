import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export let fetchStargazer = async () => {
  try {
    let resp = await octokit.request('GET /repos/{owner}/{repo}/', {
      owner: 'yeolyi',
      repo: 'blog',
    });
    return resp.data.stargazers_count as number;
  } catch (e) {
    console.error(e);
    return -1;
  }
};
