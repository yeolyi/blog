import gsap from 'gsap';
import { useEffect } from 'react';

export default function InstaBg() {
  useEffect(() => {
    const heartList = [...document.querySelectorAll('.heart')];
    heartList.forEach((heart) => {
      gsap.to(heart, {
        y: -600,
        repeat: -1,
        duration: 'random(3,5)',
        opacity: 0,
        filter: 'blur(4px)',
        ease: 'sine.out',
      });
    });
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
            className="heart absolute bottom-0 list-none blur-[1px]"
            key={i}
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </ul>
    </div>
  );
}
