import chromium from '@sparticuz/chromium';
import { delay } from 'es-toolkit';
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

async function resolveRedditShortlink(shortUrl: string) {
  const response = await fetch(shortUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
    redirect: 'manual', // 자동 리디렉션 끄기
  });

  const text = await response.text();
  const match = text.match(/<a href="([^"]+)">Moved Permanently<\/a>/);

  if (match?.[1]) {
    const redirectedUrl = match[1].replace(/&amp;/g, '&'); // HTML escape 처리
    return redirectedUrl.split('?')[0];
  }

  throw new Error('리디렉션 URL을 찾을 수 없습니다.');
}

async function getRedditImages(_postUrl: string) {
  let postUrl = _postUrl;
  if (!postUrl.endsWith('/')) postUrl += '/';
  const jsonUrl = `${postUrl}.json`;

  const response = await fetch(jsonUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Reddit JSON: ${response.status}`);
  }

  const json = await response.json();
  const postData = json[0].data.children[0].data;
  const images = [];

  if (postData.is_gallery && postData.gallery_data && postData.media_metadata) {
    const items = postData.gallery_data.items;
    for (const item of items) {
      const mediaId = item.media_id;
      const media = postData.media_metadata[mediaId];
      const url = media.s.u.replace(/&amp;/g, '&');
      images.push(url);
    }
  } else if (postData.url_overridden_by_dest?.match(/\.(jpg|jpeg|png|gif)$/)) {
    images.push(postData.url_overridden_by_dest);
  }

  return images;
}

export async function getImagesFromReddit(shortUrl: string) {
  try {
    const actualUrl = shortUrl.includes('/s/')
      ? await resolveRedditShortlink(shortUrl)
      : shortUrl.split('?')[0];
    console.log(actualUrl);
    const images = await getRedditImages(actualUrl);
    console.log('✅ Images found:', images);
    return images;
  } catch (err) {
    console.error('❌ Error:', err);
    return [];
  }
}
