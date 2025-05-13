import fs from 'node:fs';
import path from 'node:path';
import snoowrap from 'snoowrap';

// Reddit API 인증 정보
const r = new snoowrap({
  userAgent: 'MyApp/1.0.0',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN,
});

console.log(
  process.env.REDDIT_REFRESH_TOKEN,
  process.env.REDDIT_CLIENT_ID,
  process.env.REDDIT_CLIENT_SECRET,
);
/**
 * 특정 서브레딧의 인기 게시물을 크롤링
 * @param {string} subreddit - 크롤링할 서브레딧 이름 (r/ 제외)
 * @param {number} startIndex - 이미지 게시물 기준 시작 인덱스 (기본값: 0)
 * @param {number} endIndex - 이미지 게시물 기준 끝 인덱스 (기본값: 100)
 */
async function crawlTopPosts(subreddit, startIndex = 0, endIndex = 100) {
  try {
    console.log(`서브레딧 r/${subreddit}의 인기 게시물 크롤링 중...`);
    console.log(`이미지 게시물 범위: ${startIndex}부터 ${endIndex}까지`);

    // 충분한 수의 게시물을 가져오기 위한 초기 요청 수 (이미지 필터링 고려하여 더 많이 요청)
    const initialLimit = endIndex * 3; // 경험적으로 약 3배 정도 요청하면 충분한 이미지를 얻을 수 있음
    const allImagePosts = [];
    let allFetched = false;
    let after = null;

    while (!allFetched) {
      // 해당 서브레딧의 all-time top 게시물 가져오기
      const fetchOptions = { time: 'all', limit: 100 }; // Reddit API는 한 번에 최대 100개까지만 가져올 수 있음

      if (after) {
        fetchOptions.after = after;
      }

      const batch = await r.getSubreddit(subreddit).getTop(fetchOptions);

      // 이미지가 있는 게시물만 필터링하여 추가
      for (const post of batch) {
        if (post.url && isImageUrl(post.url)) {
          allImagePosts.push(post);

          // 충분한 이미지 게시물을 얻었으면 중단
          if (allImagePosts.length >= endIndex) {
            allFetched = true;
            break;
          }
        }
      }

      // 더 가져올 게시물이 없거나 최대 요청 수에 도달하면 중단
      if (batch.length < 100 || allImagePosts.length >= initialLimit) {
        allFetched = true;
      } else {
        after = batch[batch.length - 1].name;
      }
    }

    console.log(`총 ${allImagePosts.length}개의 이미지 게시물을 찾았습니다.`);

    // 이미지 게시물 중에서 요청한 범위의 게시물만 선택
    const filteredPosts = allImagePosts.slice(startIndex, endIndex);

    const results = [];

    for (const post of filteredPosts) {
      results.push({
        title: post.title,
        imageUrl: post.url,
        score: post.score,
        permalink: `https://reddit.com${post.permalink}`,
      });
    }

    // 결과를 JSON 파일로 저장 (script 폴더에 저장)
    const outputPath = path.join(__dirname);
    const outputFileName = `${subreddit}_${startIndex}_${endIndex}.json`;

    fs.writeFileSync(
      path.join(outputPath, outputFileName),
      JSON.stringify(results, null, 2),
    );

    console.log(
      `크롤링 완료! ${results.length}개의 이미지 게시물이 저장되었습니다.`,
    );
    console.log(`저장 경로: ${path.join(outputPath, outputFileName)}`);
    return results;
  } catch (error) {
    console.error('크롤링 오류:', error.message);
    throw error;
  }
}

/**
 * URL이 이미지인지 확인
 * @param {string} url - 확인할 URL
 * @returns {boolean} 이미지 URL인지 여부
 */
function isImageUrl(url) {
  return /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
}

// 명령줄 인수로 서브레딧 이름, 시작 인덱스, 끝 인덱스 받기
const args = process.argv.slice(2);
const subreddit = args[0];
const startIndex = Number.parseInt(args[1]) || 0;
const endIndex = Number.parseInt(args[2]) || 100;

if (!subreddit) {
  console.error(
    '사용법: node reddit.js [서브레딧이름] [시작인덱스(선택)] [끝인덱스(선택)]',
  );
  process.exit(1);
}

crawlTopPosts(subreddit, startIndex, endIndex).catch((err) => {
  console.error('오류 발생:', err);
  process.exit(1);
});
