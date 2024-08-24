export default function GalleryControl({
  prev,
  prevDisabled,
  next,
  nextDisabled,
}: {
  prev: () => void;
  prevDisabled: boolean;
  next: () => void;
  nextDisabled: boolean;
}) {
  return (
    <div className="relative">
      <div className="absolute right-[calc(50%-var(--viewport-content)/2)] top-[18px] mr-[var(--apps-margin-inline-end)] flex gap-[18px]">
        <button
          onClick={prev}
          className="rotate-180"
          style={{ opacity: prevDisabled ? 0.42 : 1 }}
          disabled={prevDisabled}
        >
          <CircleChevron />
        </button>
        <button
          onClick={next}
          style={{ opacity: nextDisabled ? 0.42 : 1 }}
          disabled={nextDisabled}
        >
          <CircleChevron />
        </button>
      </div>
    </div>
  );
}

const CircleChevron = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    className="h-[36px] w-[36px] rounded-full bg-[rgb(210,210,215)] fill-[rgba(0,0,0,0.56)] hover:bg-[rgba(0,0,0,0.16)] hover:fill-[rgba(0,0,0,0.64)]"
    style={{ transition: 'fill 100ms linear' }}
  >
    <path d="M23.5587,16.916 C24.1447,17.4999987 24.1467,18.446 23.5647,19.034 L16.6077,26.056 C16.3147,26.352 15.9287,26.4999987 15.5427,26.4999987 C15.1607,26.4999987 14.7787,26.355 14.4867,26.065 C13.8977,25.482 13.8947,24.533 14.4777,23.944 L20.3818,17.984 L14.4408,12.062 C13.8548,11.478 13.8528,10.5279 14.4378,9.941 C15.0218,9.354 15.9738,9.353 16.5588,9.938 L23.5588,16.916 L23.5587,16.916 Z"></path>
  </svg>
);
