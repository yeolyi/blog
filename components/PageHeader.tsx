import { ReactNode } from 'react';

export default function PageHeader({
  bottomMargin = false,
  smallTitle = false,
  children,
}: {
  bottomMargin?: boolean;
  smallTitle?: boolean;
  children: ReactNode;
}) {
  return (
    <h1
      className={`${smallTitle ? 'text-5xl' : 'text-6xl'} text-white font-bold relative ${
        bottomMargin ? 'mb-16' : 'mb-8'
      }`}
    >
      {children}
      <span className="w-[1rem] h-[1rem] bg-orange absolute" />
    </h1>
  );
}
