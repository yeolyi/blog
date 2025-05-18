import chromium from '@sparticuz/chromium';
import { delay } from 'es-toolkit';
import puppeteer, { type Viewport, type Browser } from 'puppeteer';
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

  // @ts-expect-error 귀찮아
  browser =
    process.env.NODE_ENV === 'development'
      ? await puppeteer.launch({
          headless: false,
          defaultViewport: viewport,
          args: ['--hide-scrollbars'],
        })
      : await puppeteerCore.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(remoteExecutablePath),
          headless: 'shell',
          defaultViewport: viewport,
        });

  return browser;
}

export async function getInstagramImageList(url: string) {
  const browser = await getBrowser();

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    if (process.env.NODE_ENV === 'development') {
      page.on('console', (msg) => console.log('브라우저 콘솔:', msg.text()));
    }

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
    console.log('팝업 닫음');

    await delay(1000);

    // 이미지 크롤링
    const processCurrentImage = async (isFirst: boolean): Promise<string[]> => {
      const imageUrl = await page.evaluate(({ width, height }) => {
        const sibling = document.elementFromPoint(
          width / 2,
          height / 2,
        ) as HTMLElement;
        const parent = sibling.parentElement;
        const img = parent?.querySelector('img');

        if (img instanceof HTMLImageElement) return img.src;
        return null;
      }, viewport);

      if (!imageUrl) return [];

      try {
        const nextButton = await page.waitForSelector(
          'button[aria-label="다음"]',
          { timeout: 1000 },
        );
        if (!nextButton) return [imageUrl];

        console.log('다음 버튼 클릭');
        nextButton.click();

        await delay(1000);

        return [imageUrl, ...(await processCurrentImage(false))];
      } catch {
        return [imageUrl];
      }
    };

    // 모든 이미지 처리
    return await processCurrentImage(true);
  } finally {
    // await browser.close();
  }
}
