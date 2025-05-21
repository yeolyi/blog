'use server';

import { getErrMessage } from '@/utils/string';
import chromium from '@sparticuz/chromium';
import { delay } from 'es-toolkit';
import puppeteer, { type Viewport, type Browser, type Page } from 'puppeteer';
import puppeteerCore from 'puppeteer-core';

export async function crawlImage(url: string) {
  if (url.includes('reddit.com')) {
    return {
      success: true as const,
      value: await getImagesFromReddit(url),
    };
  }
  if (url.includes('instagram.com')) {
    return {
      success: true as const,
      value: await getInstagramImageList(url),
    };
  }
  return { success: false as const, error: '지원하지 않는 사이트' };
}

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
          headless: false,
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
      height / 3,
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

async function extractPostIdFromUrl(url: string) {
  const match = url.match(/comments\/([^/]+)/);
  if (!match) {
    throw new Error('올바른 Reddit 게시물 URL이 아닙니다.');
  }
  return match[1]; // post_id
}

async function fetchImagesFromPost(postId: string) {
  try {
    const { default: snoowrap } = await import('snoowrap');

    const reddit = new snoowrap({
      userAgent: 'MyRedditApp/1.0 by u/your_reddit_username',
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      refreshToken: process.env.REDDIT_REFRESH_TOKEN,
    });

    // @ts-expect-error 귀찮음
    const post = await reddit.getSubmission(postId).fetch();
    const images = [];

    if (post.is_gallery && post.media_metadata) {
      const items = post.gallery_data.items;
      for (const item of items) {
        const media = post.media_metadata[item.media_id];
        const url = media.s.u.replace(/&amp;/g, '&');
        images.push(url);
      }
    } else if (post.url?.match(/\.(jpg|jpeg|png|gif)$/)) {
      images.push(post.url);
    }

    console.log('📸 이미지 목록:', images);
    return images;
  } catch (err) {
    console.error('❌ 오류:', getErrMessage(err));
    return [];
  }
}

async function getImagesFromReddit(postUrl: string) {
  try {
    const postId = await extractPostIdFromUrl(postUrl);
    return await fetchImagesFromPost(postId);
  } catch (err) {
    console.error('❌ 에러:', getErrMessage(err));
    return [];
  }
}
