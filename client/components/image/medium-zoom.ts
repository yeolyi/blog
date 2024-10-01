import './medium-zoom.css';

import { isSvg, createOverlay, cloneTarget } from './utils';

const MARGIN = 0;
const SCROLL_OFFSET = 40;

// TODO: 소스코드 참고해 srcset 지원?
const mediumZoom = (elementList: HTMLImageElement[]) => {
  let images: HTMLImageElement[] = [];
  let isAnimating = false;
  let scrollTop = 0;

  const active: { original?: HTMLImageElement; zoomed?: HTMLImageElement } = {};
  const overlay = createOverlay();

  const handleClick = ({ target }: MouseEvent) => {
    if (target === overlay) {
      close();
      return;
    }

    if (
      !(target instanceof HTMLImageElement) ||
      images.indexOf(target) === -1
    ) {
      return;
    }

    if (active.original) {
      close();
    } else {
      open({ target });
    }
  };

  const handleScroll = () => {
    if (isAnimating || !active.original) {
      return;
    }

    if (Math.abs(scrollTop - scrollY) > SCROLL_OFFSET) {
      setTimeout(close, 150);
    }
  };

  const handleKeyup = ({ key }: KeyboardEvent) => {
    if (key === 'Escape' || key === 'Esc') {
      close();
    }
  };

  const detach = () => {
    if (active.zoomed) {
      close();
    }

    images.forEach((image) => {
      image.classList.remove('medium-zoom-image');
    });

    images = [];
  };

  const open = ({ target }: { target: HTMLImageElement }) => {
    return new Promise<void>((resolve) => {
      if (active.zoomed) {
        resolve();
        return;
      }

      scrollTop = scrollY;
      isAnimating = true;

      active.original = target;
      active.zoomed = cloneTarget(active.original);

      document.body.appendChild(overlay);
      document.body.appendChild(active.zoomed);

      // TODO: 왜 여기만 requestAnimationFrame?
      requestAnimationFrame(() => {
        document.body.classList.add('medium-zoom--opened');
      });

      active.original.classList.add('medium-zoom-image--hidden');
      active.zoomed.classList.add('medium-zoom-image--opened');

      const handleTransitioned = () => {
        isAnimating = false;
        resolve();
      };

      active.zoomed.addEventListener('click', close);
      active.zoomed.addEventListener('transitionend', handleTransitioned, {
        once: true,
      });

      active.zoomed.style.transform = getTransform(target);
    });
  };

  const close = () =>
    new Promise<void>((resolve) => {
      if (!active.original || !active.zoomed) {
        resolve();
        return;
      }

      isAnimating = true;
      document.body.classList.remove('medium-zoom--opened');
      active.zoomed.style.transform = '';

      const handleCloseEnd = () => {
        if (!active.original || !active.zoomed) return;

        active.original.classList.remove('medium-zoom-image--hidden');
        active.zoomed.classList.remove('medium-zoom-image--opened');

        document.body.removeChild(active.zoomed);
        document.body.removeChild(overlay);

        isAnimating = false;

        active.original = undefined;
        active.zoomed = undefined;

        resolve();
      };

      active.zoomed.addEventListener('transitionend', handleCloseEnd, {
        once: true,
      });
    });

  elementList
    .filter((newImage) => images.indexOf(newImage) === -1)
    .forEach((newImage) => {
      images.push(newImage);
      newImage.classList.add('medium-zoom-image');
    });

  document.addEventListener('click', handleClick);
  document.addEventListener('keyup', handleKeyup);
  document.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', close);

  return detach;
};

const getTransform = (zoomTarget: HTMLImageElement) => {
  const viewportWidth = innerWidth - MARGIN * 2;
  const viewportHeight = innerHeight - MARGIN * 2;

  const naturalWidth =
    isSvg(zoomTarget) ? viewportWidth : (
      zoomTarget.naturalWidth || viewportWidth
    );
  const naturalHeight =
    isSvg(zoomTarget) ? viewportHeight : (
      zoomTarget.naturalHeight || viewportHeight
    );
  const { top, left, width, height } = zoomTarget.getBoundingClientRect();

  const scaleX = Math.min(Math.max(width, naturalWidth), viewportWidth) / width;
  const scaleY =
    Math.min(Math.max(height, naturalHeight), viewportHeight) / height;
  const scale = Math.min(scaleX, scaleY);

  const translateX = (-left + (viewportWidth - width) / 2 + MARGIN) / scale;
  const translateY = (-top + (viewportHeight - height) / 2 + MARGIN) / scale;

  return `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`;
};

export default mediumZoom;
