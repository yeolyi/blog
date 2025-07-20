export const INSTRUCTION_SET: Record<
	string,
	{ name: string; desc: string; operand: 'value' | 'address' | 'none' }
> = {
	'0000': {
		name: 'LOAD_A',
		desc: '피연산자(값)를 레지스터 A에 불러옵니다.',
		operand: 'value',
	},
	'0001': {
		name: 'LOAD_B',
		desc: '피연산자(값)를 레지스터 B에 불러옵니다.',
		operand: 'value',
	},
	'0010': {
		name: 'NAND',
		desc: '레지스터 A와 B의 NAND 연산 결과를 A에 저장합니다.',
		operand: 'none',
	},
	'0011': {
		name: 'ADD',
		desc: '레지스터 A와 B를 더해 결과를 A에 저장합니다.',
		operand: 'none',
	},
	'0100': {
		name: 'SUB',
		desc: '레지스터 A에서 B를 빼 결과를 A에 저장합니다.',
		operand: 'none',
	},
	'0101': {
		name: 'STORE_A',
		desc: '레지스터 A의 값을 피연산자(주소)에 저장합니다.',
		operand: 'address',
	},
	'0110': {
		name: 'STORE_B',
		desc: '레지스터 B의 값을 피연산자(주소)에 저장합니다.',
		operand: 'address',
	},
	'0111': {
		name: 'LOAD_A_MEM',
		desc: '피연산자(주소)의 값을 레지스터 A로 불러옵니다.',
		operand: 'address',
	},
	'1000': {
		name: 'LOAD_B_MEM',
		desc: '피연산자(주소)의 값을 레지스터 B로 불러옵니다.',
		operand: 'address',
	},
};
