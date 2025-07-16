const WORD = 'CRAFT';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// 초기 문자들의 알파벳 인덱스 구하기
const getInitialIndices = () => {
	return WORD.split('').map((char) => ALPHABET.indexOf(char));
};

export default function CraftTypography() {
	const charIndices = getInitialIndices();

	return (
		<div className='flex items-center justify-center select-none w-full h-full aspect-video min-h-[384px]'>
			<div className='flex items-center gap-2 relative'>
				{/* 선택된 항목을 강조하는 배경 */}
				<div className='absolute inset-0 flex items-center justify-center'>
					<div className='w-full h-[min(12vw,130px)] bg-card border border-border'></div>
				</div>
				{charIndices.map((currentIdx, charIdx) => {
					const prevIdx = (currentIdx - 1 + ALPHABET.length) % ALPHABET.length;
					const nextIdx = (currentIdx + 1) % ALPHABET.length;

					const prevChar = ALPHABET[prevIdx];
					const currentChar = ALPHABET[currentIdx];
					const nextChar = ALPHABET[nextIdx];

					return (
						<div
							key={charIdx}
							className='flex items-center flex-col text-[min(12vw,130px)] w-[min(12vw,130px)]'
							style={{ perspective: '200px' }}
						>
							<span
								className='leading-none font-black text-muted-foreground opacity-30'
								style={{ transform: 'rotateX(30deg)' }}
							>
								{prevChar}
							</span>
							<span className='leading-none font-black text-black dark:text-white'>
								{currentChar}
							</span>
							<span
								className='leading-none font-black text-muted-foreground opacity-30'
								style={{ transform: 'rotateX(-30deg)' }}
							>
								{nextChar}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
