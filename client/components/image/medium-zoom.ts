import './medium-zoom.css';

import { isSvg, createOverlay, cloneTarget } from './utils.ts';

const SCROLL_OFFSET = 40;

// TODO: 소스코드 참고해 srcset 지원?
const mediumZoom = (elementList: HTMLImageElement[]) => {
  const images: Set<HTMLImageElement> = new Set(elementList);

  let isAnimating = false;
  let scrollTop = 0;

  let focused:
    | { original: undefined; zoomed: undefined }
    | { original: HTMLImageElement; zoomed: undefined }
    | { original: HTMLImageElement; zoomed: HTMLImageElement } = {
    original: undefined,
    zoomed: undefined,
  };

  const overlay = createOverlay();

  const open = ({ target }: { target: HTMLImageElement }) => {
    if (focused.zoomed) return;

    scrollTop = scrollY;
    isAnimating = true;

    focused = { original: target, zoomed: cloneTarget(target) };

    overlay.addEventListener('click', close);
    document.body.appendChild(overlay);
    document.body.appendChild(focused.zoomed);

    // TODO: 왜 여기만 requestAnimationFrame?
    requestAnimationFrame(() => {
      document.body.classList.add('medium-zoom--opened');
    });

    focused.original.classList.add('medium-zoom-image--hidden');
    focused.zoomed.classList.add('medium-zoom-image--opened');

    focused.zoomed.addEventListener('click', close);

    const handleTransitioned = () => {
      isAnimating = false;
    };

    focused.zoomed.addEventListener('transitionend', handleTransitioned, {
      once: true,
    });

    focused.zoomed.style.transform = getTransform(target);
  };

  const close = () => {
    if (!focused.original || !focused.zoomed) return;

    isAnimating = true;
    document.body.classList.remove('medium-zoom--opened');
    focused.zoomed.style.transform = '';

    const handleCloseEnd = () => {
      if (!focused.original || !focused.zoomed) return;

      focused.original.classList.remove('medium-zoom-image--hidden');
      focused.zoomed.classList.remove('medium-zoom-image--opened');

      document.body.removeChild(focused.zoomed);
      document.body.removeChild(overlay);

      isAnimating = false;

      focused = { original: undefined, zoomed: undefined };
    };

    focused.zoomed.addEventListener('transitionend', handleCloseEnd, {
      once: true,
    });

    overlay.removeEventListener('click', close);
  };

  const handleScroll = () => {
    if (isAnimating || !focused.original) {
      return;
    }

    if (Math.abs(scrollTop - scrollY) > SCROLL_OFFSET) {
      setTimeout(close, 100);
    }
  };

  const handleKeyup = ({ key }: KeyboardEvent) => {
    if (key === 'Escape' || key === 'Esc') {
      close();
    }
  };

  const handleClick = (event: MouseEvent) => {
    if (focused.original) {
      close();
    } else {
      open({ target: event.target as HTMLImageElement });
    }
  };

  // attach & detach
  const attach = () => {
    document.addEventListener('keyup', handleKeyup);
    document.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', close);

    images.forEach((image) => {
      image.classList.add('medium-zoom-image');
      image.addEventListener('click', handleClick);
    });
  };

  const detach = () => {
    if (focused.zoomed) {
      close();
    }

    images.forEach((image) => {
      image.classList.remove('medium-zoom-image');
      image.removeEventListener('click', handleClick);
    });

    images.clear();

    document.removeEventListener('keyup', handleKeyup);
    document.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', close);
  };

  attach();

  return detach;
};

const getTransform = (zoomTarget: HTMLImageElement) => {
  const margin = 5;

  const viewportWidth = innerWidth - margin * 2;
  const viewportHeight = innerHeight - margin * 2;

  const naturalWidth =
    isSvg(zoomTarget) ? viewportWidth : (
      zoomTarget.naturalWidth || viewportWidth
    );
  const naturalHeight =
    isSvg(zoomTarget) ? viewportHeight : (
      zoomTarget.naturalHeight || viewportHeight
    );

  const { top, left, width, height } = zoomTarget.getBoundingClientRect();

  // 사진을 가능한 원본 크기로 확대
  const scaleX = Math.min(Math.max(width, naturalWidth), viewportWidth) / width;
  const scaleY =
    Math.min(Math.max(height, naturalHeight), viewportHeight) / height;
  const scale = Math.min(scaleX, scaleY);

  // 확대된 사진을 중앙으로 이동
  const translateX = (-left + (viewportWidth - width) / 2 + margin) / scale;
  const translateY = (-top + (viewportHeight - height) / 2 + margin) / scale;

  return `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`;
};

export default mediumZoom;
