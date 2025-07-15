import { encode } from '@jsquash/avif';
import { toast } from 'sonner';

/**
 * File → AVIF Blob 변환
 * @param file 이미지 File 객체 (jpg, png, etc)
 * @param quality 0~100 사이 품질 설정 (기본: 50)
 */
export async function fileToAvifBlob(
	file: File,
	quality: number = 50,
): Promise<Blob | string> {
	// 1. 파일을 이미지 엘리먼트로 로드
	const img = await loadImageFromFile(file);

	// 2. canvas에 그리기
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	if (ctx === null) {
		return 'Failed to convert image to AVIF';
	}
	ctx.drawImage(img, 0, 0);

	// 3. canvas에서 ImageData 추출
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	// 4. AVIF 인코딩 (Uint8Array 반환)
	const avifBuffer = await encode(imageData, { quality });

	// 5. AVIF Blob 생성
	return new Blob([avifBuffer], { type: 'image/avif' });
}

/**
 * File → HTMLImageElement 로 로드
 */
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = URL.createObjectURL(file);
	});
}
