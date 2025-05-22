import JSConfetti from 'js-confetti';

let jsConfetti: InstanceType<typeof JSConfetti> | null = null;

export const confetti = (confettiNumber: number) => {
  if (!jsConfetti) jsConfetti = new JSConfetti();

  jsConfetti.addConfetti({
    confettiNumber,
    confettiRadius: 4,
    confettiColors: [
      '#D94773',
      '#D983A6',
      '#DB94BE',
      '#DFB0D3',
      '#E4D0ED',
      '#EEE6FB',
    ],
  });
};
