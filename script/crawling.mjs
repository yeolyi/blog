import { chromium } from 'playwright';
import fs from 'node:fs';

async function openProgrammerHumor() {
  // 브라우저 실행
  const browser = await chromium.launch({ headless: false });

  // 새 페이지 생성
  const page = await browser.newPage();

  try {
    // programmerhumor.io/hot 페이지로 이동
    console.log('programmerhumor.io/hot 페이지로 이동 중...');
    await page.goto('https://programmerhumor.io/hot', {
      waitUntil: 'networkidle',
    });
    console.log('페이지 로드 완료!');

    // time-filter-buttons 클래스 아래의 마지막 자식 버튼 클릭
    // Locator API 사용
    const timeFilterButtons = page.locator('.time-filter-buttons');
    await timeFilterButtons.waitFor(); // 요소가 나타날 때까지 대기

    const lastButton = page.locator('.time-filter-buttons > button:last-child');
    await lastButton.click();
    console.log('All Time 필터 클릭됨');

    // 스크롤하면서 .post 요소 수집
    const targetPostCount = 1000; // N개의 포스트를 원하는 경우 이 값을 조정하세요

    // 현재 로드된 .post 요소 개수 확인 함수 (Locator API 사용)
    const postLocator = page.locator('.post');

    // 초기 포스트 개수 확인
    await postLocator.first().waitFor(); // 최소 하나의 포스트가 로드될 때까지 기다림
    let currentPostCount = await postLocator.count();
    console.log(`현재 로드된 포스트 개수: ${currentPostCount}`);

    // 목표 개수에 도달할 때까지 스크롤
    while (currentPostCount < targetPostCount) {
      // 페이지 맨 아래로 스크롤
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // 새 콘텐츠가 로드될 시간을 주기 위해 잠시 대기
      await page.waitForTimeout(1500);

      // 새로운 포스트 개수 확인
      const newPostCount = await postLocator.count();

      // 더 이상 새 포스트가 로드되지 않으면 종료
      if (newPostCount === currentPostCount) {
        console.log('더 이상 새 포스트가 로드되지 않습니다.');
        break;
      }

      currentPostCount = newPostCount;
      console.log(`현재 로드된 포스트 개수: ${currentPostCount}`);
    }

    // 로드된 모든 포스트에서 필요한 정보 추출 (Locator API 사용)
    const posts = [];

    // 모든 포스트 요소에 대해 반복 (Locator.all() 사용)
    const count = await postLocator.count();
    for (let i = 0; i < count; i++) {
      const post = postLocator.nth(i);

      // 제목 추출
      const titleElement = post.locator('.post-title');
      const title = (await titleElement.textContent()) || '';

      // 이미지 URL 추출
      const imgElement = post.locator('img');
      let media_url = '';
      if ((await imgElement.count()) > 0) {
        media_url = (await imgElement.getAttribute('src')) || '';
      }

      // 설명 추출
      const excerptElement = post.locator('.post-excerpt-short');
      let description = '';
      if ((await excerptElement.count()) > 0) {
        description = (await excerptElement.textContent()) || '';
      }

      posts.push({
        title: title.trim(),
        description: description.trim(),
        media_url,
      });
    }

    console.log(`총 ${posts.length}개의 포스트 정보를 추출했습니다.`);
    const json = JSON.stringify(posts);
    fs.writeFileSync('posts.json', json);

    new Promise((resolve) => setTimeout(resolve, 1000000));
  } catch (error) {
    console.error('에러 발생:', error);
  } finally {
    // await browser.close();
    console.log('브라우저가 종료되었습니다.');
  }
}

// 함수 실행
openProgrammerHumor();
