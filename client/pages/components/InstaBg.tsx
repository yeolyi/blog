import { random } from 'es-toolkit';
import { useEffect } from 'react';

export default function InstaBg() {
  useEffect(() => {
    const heartList = [
      ...document.querySelectorAll('.heart'),
    ] as HTMLLIElement[];

    const parentHeight = parseInt(
      getComputedStyle(document.body).getPropertyValue('--wide-tile-height'),
    );

    let positionPercentage = Array(heartList.length)
      .fill(0)
      .map(() => random(1));

    let done = false;
    let prevTime = 0;

    const update: FrameRequestCallback = (time) => {
      if (done) return;
      requestAnimationFrame(update);

      const delta = time - prevTime;
      prevTime = time;
      positionPercentage = positionPercentage.map((x) => {
        return (x + delta / 5000) % 1.1;
      });

      const opacity = positionPercentage
        .map((x) => Math.min(100, x * 200 + 10))
        .map((x) => `${x}%`);

      const position = positionPercentage.map((x) => -x * parentHeight + 'px');

      heartList.forEach((heart, idx) => {
        heart.style.transform = `translate(0, ${position[idx]})`;
        heart.style.opacity = opacity[idx];
      });
    };

    requestAnimationFrame(update);

    return () => {
      done = true;
    };
  }, []);

  return (
    <div
      className="h-full w-full"
      style={{
        background: `radial-gradient(
                        circle at 30% -7%,
                        #fdf497 0%,
                        #fdf497 5%,
                        #fd5949 45%,
                        #d6249f 60%,
                        #285aeb 90%
                    )`,
      }}
    >
      <ul className="relative h-full w-full">
        {[...Array(30).keys()].map((i) => (
          <li
            suppressHydrationWarning
            className="heart absolute bottom-0 list-none blur-[1px] will-change-transform"
            key={i}
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </ul>
    </div>
  );
}
