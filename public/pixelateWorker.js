// 웹 워커 내에서 이미지 픽셀화 처리
self.onmessage = (e) => {
  const { imageData, pixelCnt, width, height } = e.data;

  try {
    // 캔버스 생성 시도 (폴리필 포함)
    const canvas = self.OffscreenCanvas
      ? new OffscreenCanvas(width, height)
      : createFallbackCanvas(width, height);

    const ctx =
      canvas instanceof OffscreenCanvas
        ? canvas.getContext('2d', { willReadFrequently: true })
        : canvas.ctx;

    if (!ctx) {
      throw new Error('Canvas Context를 생성할 수 없습니다.');
    }

    // 이미지 데이터 설정
    const newImageData = new ImageData(
      new Uint8ClampedArray(imageData),
      width,
      height,
    );

    ctx.putImageData(newImageData, 0, 0);

    // 픽셀 블록 크기 계산
    const blockWidth = Math.ceil(width / pixelCnt);
    const blockHeight = Math.ceil(height / pixelCnt);

    // 이미지 데이터 가져오기
    const originalData = ctx.getImageData(0, 0, width, height).data;

    // 이미지 데이터 초기화
    ctx.clearRect(0, 0, width, height);

    // 각 픽셀 블록에 대해 평균 색상을 계산하고 그 블록을 해당 색상으로 채움
    for (let y = 0; y < pixelCnt; y++) {
      for (let x = 0; x < pixelCnt; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let count = 0;

        // 각 블록의 시작/끝 좌표 계산 (이미지 가장자리 처리)
        const startX = x * blockWidth;
        const endX = Math.min((x + 1) * blockWidth, width);
        const startY = y * blockHeight;
        const endY = Math.min((y + 1) * blockHeight, height);

        // 블록 내의 모든 픽셀에 대한 색상의 합 계산
        for (let blockY = startY; blockY < endY; blockY++) {
          for (let blockX = startX; blockX < endX; blockX++) {
            const i = (blockY * width + blockX) * 4;
            r += originalData[i];
            g += originalData[i + 1];
            b += originalData[i + 2];
            a += originalData[i + 3];
            count++;
          }
        }

        // 색상 평균 계산
        if (count > 0) {
          r = Math.floor(r / count);
          g = Math.floor(g / count);
          b = Math.floor(b / count);
          a = Math.floor(a / count);

          // 해당 블록을 평균 색상으로 채움
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
          ctx.fillRect(startX, startY, endX - startX, endY - startY);
        }
      }
    }

    // 픽셀화된 이미지를 Blob으로 변환 후 메인 스레드로 전송
    const blobPromise =
      canvas instanceof OffscreenCanvas
        ? canvas.convertToBlob({ type: 'image/png' })
        : canvas.convertToBlob({ type: 'image/png' });

    blobPromise
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          self.postMessage({ status: 'success', result: reader.result });
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
        self.postMessage({
          status: 'error',
          error: error.message || '이미지 변환 중 오류가 발생했습니다.',
        });
      });
  } catch (error) {
    self.postMessage({
      status: 'error',
      error: error.message || '처리 중 오류가 발생했습니다.',
    });
  }
};
