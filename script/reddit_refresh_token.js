import snoowrap from 'snoowrap';

snoowrap
  .fromAuthCode({
    code: process.env.REDDIT_AUTH_CODE,
    userAgent: 'MyRedditBot/1.0 by your_username',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    redirectUri: 'http://localhost:8080',
  })
  .then((r) => {
    console.log('✅ Your refresh token:', r.refreshToken);
  })
  .catch((err) => {
    console.error('❌ Failed to get refresh token:', err);
  });
