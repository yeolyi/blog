'use server';
import chromium from '@sparticuz/chromium';
import { delay } from 'es-toolkit';
import puppeteer, { type Browser } from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import { getErrMessage } from '@/utils/string';

const VIEWPORT = { width: 375, height: 667 };
const DELAY_TIME = 500;

const getBrowser = (() => {
	chromium.setGraphicsMode = false;

	let browser: Browser;

	return async () => {
		if (browser) return browser;

		// @ts-expect-error 귀찮음
		browser =
			process.env.NODE_ENV === 'development'
				? await puppeteer.launch({
						headless: false,
						defaultViewport: VIEWPORT,
					})
				: await puppeteerCore.launch({
						args: [...chromium.args],
						executablePath: await chromium.executablePath(
							'https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar',
						),
						headless: 'shell',
						defaultViewport: VIEWPORT,
					});

		return browser;
	};
})();

async function crawlInstagram(url: string) {
	const browser = await getBrowser();
	const page = await browser.newPage();

	try {
		const urlWithoutQuery = url.split('?')[0];

		await page.setExtraHTTPHeaders({
			'Accept-Language': 'ko-KR',
		});

		await page.goto(urlWithoutQuery, {
			waitUntil: 'networkidle0',
			timeout: 15000,
		});

		// 팝업 닫기
		const closeButton = await page.waitForSelector('svg[aria-label="닫기"]', {
			timeout: 5000,
			visible: true,
		});
		const buttonPosition = await closeButton?.boundingBox();
		if (!buttonPosition) throw new Error('닫기을 찾지 못했습니다.');

		const x = buttonPosition.x + buttonPosition.width / 2;
		const y = buttonPosition.y + buttonPosition.height / 2;
		await page.mouse.click(x, y);

		// 잠시 대기
		await delay(300);

		const clickNext = async () => {
			const nextButton = await page
				.waitForSelector('button[aria-label="다음"]', {
					timeout: DELAY_TIME,
				})
				.catch(() => null);
			if (!nextButton) return false;

			await nextButton.click();
			return true;
		};

		// 이미지 가져오기
		const images: string[] = [];
		let retry = false;

		while (true) {
			const imageUrl = await page.evaluate(({ width, height }) => {
				const sibling = document.elementFromPoint(
					width / 2,
					height / 3,
				) as HTMLElement;
				const parent = sibling.parentElement;
				const img = parent?.querySelector('img');

				if (img instanceof HTMLImageElement) return img.src;
				return null;
			}, VIEWPORT);

			if (!imageUrl) break;

			// 버튼이 한번씩 무시돼서 재시도 로직이 있어야 함
			if (images.includes(imageUrl)) {
				if (retry) break;
				retry = true;
				await clickNext();
				await delay(DELAY_TIME);
				continue;
			}
			retry = false;

			images.push(imageUrl);

			await clickNext();
			await delay(DELAY_TIME);
		}

		return images;
	} finally {
		await page.close();
	}
}

export async function crawlInstagramAction(url: string) {
	try {
		return await crawlInstagram(url);
	} catch (e) {
		return getErrMessage(e);
	}
}
