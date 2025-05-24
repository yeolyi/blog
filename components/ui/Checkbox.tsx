import { bgMap } from '@/components/ui/theme';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import type * as React from 'react';

// radix-ui의 프롭과 동일하게 사용
const Checkbox = ({
  className,
  ...props
}: CheckboxPrimitive.CheckboxProps &
  React.RefAttributes<HTMLButtonElement>) => (
  <CheckboxPrimitive.Root
    className={clsx('h-8 w-8 shrink-0 cursor-pointer', bgMap.gray, className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={clsx('text-white')}>
      <CheckIcon size={24} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);

export { Checkbox };
