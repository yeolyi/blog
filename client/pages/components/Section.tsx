import { ReactNode } from 'react';

const Section = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <section
    className={`pt-[54px] sm:pt-[62px] md:pt-[71px] lg:pt-[87px] ${className}`}
  >
    {children}
  </section>
);

const Top = ({ children }: { children: ReactNode }) => (
  <section className="horizontal-pad flex flex-col items-start justify-between pt-[56px] sm:pt-[64px] md:pt-[72px] lg:flex-row lg:items-center lg:pt-[80px]">
    {children}
  </section>
);

const Headline = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <h2
    className={`mb-[28px] text-[28px] font-semibold leading-[1.25] tracking-[0] text-[#86868b] sm:mb-[32px] sm:text-[32px] md:mb-[36px] md:text-[40px] lg:mb-[40px] lg:text-[48px] [&>strong]:font-semibold [&>strong]:text-textblack ${className}`}
  >
    {children}
  </h2>
);

export default Object.assign(Section, { Headline, Top });