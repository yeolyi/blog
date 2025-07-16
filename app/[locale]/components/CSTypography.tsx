export default function CSTypography({ className }: { className?: string }) {
	return (
		// <svg
		// 	className={cn(
		// 		className,
		// 		'fill-black dark:fill-white min-h-[384px] aspect-video py-7',
		// 	)}
		// 	width='100%'
		// 	height='100%'
		// 	viewBox='0 0 200 200'
		// >
		// 	<title>nand is more than just nand</title>
		// 	<defs>
		// 		<path
		// 			id='circlePath'
		// 			d='M100,100 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0'
		// 		/>
		// 	</defs>
		// 	<text fontSize='22px' fontWeight='800'>
		// 		<textPath href='#circlePath'>
		// 			nand is more than just nand is more than just
		// 		</textPath>
		// 	</text>
		// </svg>
		<div className='aspect-video max-h-[384px] text-[min(7.5vw,63px)]  leading-none font-black text-stone-200 dark:text-stone-800 select-none overflow-hidden break-all text-justify'>
			{'NAND IS MORE THAN JUST '.repeat(2)}
			<span className='text-black dark:text-white'>
				NAND IS MORE THAN JUST NAND{' '}
			</span>
			IS MORE THAN JUST {'NAND IS MORE THAN JUST '.repeat(20)} NAND
		</div>
	);
}
