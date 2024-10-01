export const isSvg = (image: HTMLImageElement) => {
  const source = image.currentSrc || image.src;
  return source.slice(-4).toLowerCase() === '.svg';
};

export const createOverlay = () => {
  const overlay = document.createElement('div');
  overlay.classList.add('medium-zoom-overlay');
  return overlay;
};

export const cloneTarget = (template: HTMLImageElement) => {
  const { top, left, width, height } = template.getBoundingClientRect();
  const clone = template.cloneNode() as HTMLImageElement;

  clone.removeAttribute('id');
  clone.style.position = 'absolute';
  clone.style.top = `${top + scrollY}px`;
  clone.style.left = `${left + scrollX}px`;
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.transform = '';

  return clone;
};
