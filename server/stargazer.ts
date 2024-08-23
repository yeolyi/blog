import { Octokit } from 'octokit';
import { Cache } from './cache';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export let stargazerCache = new Cache(async () => {
  try {
    let resp = await octokit.request('GET /repos/{owner}/{repo}/', {
      owner: 'yeolyi',
      repo: 'blog',
    });
    return resp.data.stargazers_count;
  } catch {
    return -1;
  }
}, 60 * 1000);
