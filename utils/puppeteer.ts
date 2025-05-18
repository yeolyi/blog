import chromium from '@sparticuz/chromium';
import { delay } from 'es-toolkit';
import { JSDOM } from 'jsdom';
import puppeteer, { type Viewport, type Browser, type Page } from 'puppeteer';
import puppeteerCore from 'puppeteer-core';

const remoteExecutablePath =
  'https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar';

chromium.setGraphicsMode = false;
let browser: Browser;
const viewport: Viewport = {
  width: 375,
  height: 667,
};

async function getBrowser() {
  if (browser) return browser;

  // @ts-expect-error 귀찮음
  browser =
    process.env.NODE_ENV === 'development'
      ? await puppeteer.launch({
          headless: 'shell',
          defaultViewport: viewport,
        })
      : await puppeteerCore.launch({
          args: [...chromium.args],
          executablePath: await chromium.executablePath(remoteExecutablePath),
          headless: 'shell',
          defaultViewport: viewport,
        });

  return browser;
}

const closePopup = async (page: Page) => {
  // 팝업 닫기
  const closeButton = await page.waitForSelector('svg[aria-label="닫기"]', {
    timeout: 5000,
    visible: true,
  });

  if (!closeButton) throw new Error('닫기 버튼을 찾지 못했습니다.');
  const buttonPosition = await closeButton.boundingBox();
  if (!buttonPosition) throw new Error('닫기 버튼 위치를 찾지 못했습니다.');

  const x = buttonPosition.x + buttonPosition.width / 2;
  const y = buttonPosition.y + buttonPosition.height / 2;
  await page.mouse.click(x, y);
};

const DELAY_TIME = 100;

const getNextButton = async (page: Page) => {
  try {
    return await page.waitForSelector('button[aria-label="다음"]', {
      timeout: DELAY_TIME,
    });
  } catch {
    return null;
  }
};

const tryImageUrl = async (page: Page) => {
  return await page.evaluate(({ width, height }) => {
    const sibling = document.elementFromPoint(
      width / 2,
      height / 2,
    ) as HTMLElement;
    const parent = sibling.parentElement;
    const img = parent?.querySelector('img');

    if (img instanceof HTMLImageElement) return img.src;
    return null;
  }, viewport);
};

const getImageUrl = async (
  page: Page,
  isDuplicate: (url: string) => boolean,
) => {
  while (true) {
    const imageUrl = await tryImageUrl(page);
    if (!imageUrl) return null;

    if (!isDuplicate(imageUrl)) return imageUrl;

    // 가끔 버튼이 씹힘
    const nextButton = await getNextButton(page);
    if (!nextButton) return null;
    nextButton.click();
    await delay(DELAY_TIME);
  }
};

const iterateImages = async (
  page: Page,
  isDuplicate: (url: string) => boolean,
): Promise<string[]> => {
  const imageUrl = await getImageUrl(page, isDuplicate);
  if (!imageUrl) return [];

  const nextButton = await getNextButton(page);
  if (!nextButton) return [imageUrl];

  await nextButton.click();
  await delay(DELAY_TIME);

  return [
    imageUrl,
    ...(await iterateImages(
      page,
      (url) => isDuplicate(url) || imageUrl === url,
    )),
  ];
};

export async function getInstagramImageList(url: string) {
  const urlWithoutQuery = url.split('?')[0];
  const browser = await getBrowser();

  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'ko-KR',
  });

  await page.goto(urlWithoutQuery, {
    waitUntil: 'networkidle0',
    timeout: 15000,
  });

  await closePopup(page);
  await delay(300);

  const images = await iterateImages(page, () => false);
  await page.close();

  return images;
}

export async function getRedditImageList(url: string) {
  const tmp = url.split('?')[0];
  const jsonUrl = tmp.endsWith('.json') ? tmp : `${tmp}.json`;

  const response = await fetch(jsonUrl);

  if (!response.ok) {
    throw new Error(`레딧 API 요청 실패: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);

  // 이미지 URL 추출
  const images: string[] = [];

  // 포스트 데이터 접근
  const posts = data[0]?.data?.children || [];

  for (const post of posts) {
    const postData = post.data;

    // 이미지 URL이 직접 있는 경우 (이미지 포스트)
    if (postData?.url && isImageUrl(postData.url)) {
      images.push(postData.url);
      continue;
    }

    // gallery 형태의 포스트인 경우
    if (postData?.gallery_data && postData?.media_metadata) {
      const galleryItems = postData.gallery_data.items || [];
      for (const item of galleryItems) {
        const mediaId = item.media_id;
        const mediaItem = postData.media_metadata[mediaId];
        if (mediaItem && typeof mediaItem === 'object' && 's' in mediaItem) {
          const source = mediaItem.s as {
            u?: string;
            gif?: string;
            mp4?: string;
          };
          const imageUrl = source.u || source.gif || source.mp4 || '';
          if (imageUrl) images.push(imageUrl);
        }
      }
      continue;
    }

    // preview 이미지가 있는 경우
    if (postData?.preview && postData.preview.images?.length > 0) {
      const previewImages = postData.preview.images;
      for (const previewImage of previewImages) {
        // 가장 높은 해상도의 이미지 선택
        if (previewImage.source) {
          const imageUrl = previewImage.source.url.replace(/&amp;/g, '&');
          images.push(imageUrl);
        }
      }
    }
  }

  // 댓글 내 이미지도 추출 (있을 경우)
  const comments = data[1]?.data?.children || [];
  for (const comment of comments) {
    const commentData = comment.data;
    if (commentData?.media_metadata) {
      for (const [, mediaItem] of Object.entries(commentData.media_metadata)) {
        if (
          typeof mediaItem === 'object' &&
          mediaItem !== null &&
          's' in mediaItem
        ) {
          const source = mediaItem.s as {
            u?: string;
            gif?: string;
            mp4?: string;
          };
          const imageUrl = source.u || source.gif || source.mp4 || '';
          if (imageUrl) images.push(imageUrl);
        }
      }
    }
  }

  // https://www.reddit.com/r/redditdev/comments/1cdmu02/getting_403_when_trying_to_download_pictures_from/
  return [...new Set(images)]
    .map((str) => {
      const dom = new JSDOM(str);
      const decoded = dom.window.document.documentElement.textContent;
      return decoded;
    })
    .filter((x): x is string => x !== null);
}

// 이미지 URL인지 확인하는 헬퍼 함수
function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return (
    imageExtensions.some((ext) => url.toLowerCase().endsWith(ext)) ||
    url.includes('i.redd.it') ||
    url.includes('i.imgur.com')
  );
}
