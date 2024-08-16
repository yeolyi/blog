import { ReactNode } from 'react';

export let Section = ({
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

export let TopSection = ({ children }: { children: ReactNode }) => (
  <section className="horizontal-pad flex flex-col items-start justify-between pt-[56px] sm:pt-[64px] md:pt-[72px] lg:flex-row lg:items-center lg:pt-[80px]">
    {children}
  </section>
);

export let Headline = ({ children }: { children: ReactNode }) => (
  <h1 className="mr-[30px] text-[40px] font-semibold leading-[1.2] text-textblack sm:text-[48px] sm:leading-[1.1875] md:text-[64px] md:leading-[1.171875] lg:text-[80px] lg:leading-[1.15]">
    {children}
  </h1>
);

export let Copy = ({ children }: { children: ReactNode }) => (
  <p className="mt-[10px] w-auto max-w-[430px] text-[19px] font-semibold leading-[1.32] tracking-[0.012em] text-textblack min-[590px]:max-w-[535px] lg:w-[390px] lg:text-[21px]">
    {children}
  </p>
);

export let SectionHeadline = ({
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
