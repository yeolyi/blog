'use client';
import type * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export const TagOption = ({
	id,
	name,
	value,
	checked,
	onCheckedChange,
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) => {
	return (
		<div className='relative'>
			<Checkbox
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
				className='peer sr-only'
				data-tag-checkbox
				data-value={value}
				name={name}
			/>
			<Label
				htmlFor={id}
				className='inline-block cursor-pointer select-none border-2 border-transparent bg-stone-700 px-2 py-1 text-sm text-white transition-opacity peer-data-[state=checked]:border-white hover:opacity-80 active:opacity-60'
			>
				{value}
			</Label>
		</div>
	);
};

export default TagOption;
