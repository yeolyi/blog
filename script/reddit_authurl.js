import snoowrap from 'snoowrap';

const snoowrapConfig = {
  userAgent: 'MyApp/1.0.0',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  redirectUri: 'http://localhost:8080',
};

const authenticationUrl = snoowrap.getAuthUrl({
  clientId: snoowrapConfig.clientId,
  scope: ['read'], // 필요한 권한 범위
  redirectUri: snoowrapConfig.redirectUri,
  permanent: true,
  state: 'any-random-string',
});

console.log(authenticationUrl);
