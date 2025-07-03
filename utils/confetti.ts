import _confetti from 'canvas-confetti';

export const confetti = (opts?: _confetti.Options) => {
	function fire(particleRatio: number, opts2: _confetti.Options) {
		_confetti({
			particleCount: Math.floor((window.innerWidth / 2.5) * particleRatio),
			colors: ['#D94773', '#D983A6', '#DB94BE', '#DFB0D3', '#E4D0ED', '#EEE6FB'],
			disableForReducedMotion: true,
			...opts2,
			...opts,
		});
	}

	fire(0.25, {
		spread: 26,
		startVelocity: 55,
	});
	fire(0.2, {
		spread: 60,
	});
	fire(0.35, {
		spread: 100,
		decay: 0.91,
		scalar: 0.8,
	});
	fire(0.1, {
		spread: 120,
		startVelocity: 25,
		decay: 0.92,
		scalar: 1.2,
	});
	fire(0.1, {
		spread: 120,
		startVelocity: 45,
	});
};
