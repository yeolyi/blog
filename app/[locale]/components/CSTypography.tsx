export default function CSTypography() {
	return (
		<div className='aspect-video max-h-[384px] text-[min(7.5vw,63px)] leading-none font-black text-stone-200 dark:text-stone-800 overflow-hidden break-all text-justify w-full'>
			{'NAND IS MORE THAN JUST '.repeat(2)}
			<span className='text-black dark:text-white lg:text-inherit lg:dark:text-inherit'>
				NAND IS MORE THAN JUST NAND{' '}
			</span>
			<span className='lg:text-black lg:dark:text-white'>
				<span className='hidden lg:inline'>NAND</span> IS MORE THAN JUST NAND
			</span>{' '}
			IS MORE THAN JUST NAND {'NAND IS MORE THAN JUST '.repeat(20)} NAND
		</div>
	);
}
