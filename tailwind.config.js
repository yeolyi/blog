/** @type {import('tailwindcss').Config} */
module.exports = {
	theme: {
		extend: {
			animation: {
				marquee: 'marquee 30s linear infinite',
				marquee2: 'marquee2 30s linear infinite',
				'marquee-reverse': 'marquee-reverse 30s linear infinite',
				'marquee-reverse2': 'marquee-reverse2 30s linear infinite',
			},
			keyframes: {
				marquee: {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-100%)' },
				},
				marquee2: {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0%)' },
				},
				'marquee-reverse': {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(100%)' },
				},
				'marquee-reverse2': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0%)' },
				},
			},
		},
	},
};
