import { useTranslations } from 'next-intl';
import { useState } from 'react';

// --- ISA Definition ---
export const REGISTERS = { R0: 0, R1: 1, R2: 2, R3: 3 };
export const REG_MAP = ['R0', 'R1', 'R2', 'R3'];

export const INSTRUCTION_SET = {
	'0000': { name: 'MOVE', type: 'R-Type' },
	'0001': { name: 'ADD', type: 'R-Type' },
	'0010': { name: 'SUB', type: 'R-Type' },
	'0100': { name: 'ADDI', type: 'I-Type' },
	'0101': { name: 'SUBI', type: 'I-Type' },
	'0110': { name: 'LDI', type: 'I-Type' },
	'1000': { name: 'LOAD', type: 'M-Type' },
	'1001': { name: 'STORE', type: 'M-Type' },
	'1100': { name: 'JUMP', type: 'M-Type' },
	'1101': { name: 'JZ', type: 'M-Type' },
} as const;
// --- End of ISA Definition ---

export function useVonNeumann() {
	const t = useTranslations('VonNeumann.Simulator');
	const [code, setCode] = useState(t('defaultCode'));

	const [binaryInstructions, setBinaryInstructions] = useState<string[]>([]);
	const [mnemonicInstructions, setMnemonicInstructions] = useState<string[]>([]);
	const [isRunning, setIsRunning] = useState(false);
	const [pc, setPc] = useState(0);
	const [regs, setRegs] = useState<number[]>(Array(4).fill(0));
	const [zFlag, setZFlag] = useState(0);
	const [memory, setMemory] = useState(new Array(16).fill(0));

	const handleLoad = () => {
		const lines = code
			.split('\n')
			.map((line) => line.split('//')[0].trim())
			.filter(Boolean);

		const parsedCode = lines.map((line) => {
			if (/^[01]{8}$/.test(line)) return line;

			const parts = line.split(/[\s,]+/);
			const mnemonic = parts[0].toUpperCase();
			const args = parts.slice(1);

			const instructionEntry = Object.entries(INSTRUCTION_SET).find(
				([, val]) => val.name === mnemonic,
			);
			if (!instructionEntry) return '';

			const opcode = instructionEntry[0];
			const info = instructionEntry[1];

			let operandBinary = '';
			if (info.type === 'R-Type') {
				const rd = REGISTERS[args[0].toUpperCase() as keyof typeof REGISTERS] || 0;
				const rs = REGISTERS[args[1].toUpperCase() as keyof typeof REGISTERS] || 0;
				operandBinary = `${rd.toString(2).padStart(2, '0')}${rs.toString(2).padStart(2, '0')}`;
			} else if (info.type === 'I-Type') {
				const rd = REGISTERS[args[0].toUpperCase() as keyof typeof REGISTERS] || 0;
				const imm = parseInt(args[1], 10) || 0;
				operandBinary = `${rd.toString(2).padStart(2, '0')}${imm.toString(2).padStart(2, '0')}`;
			} else if (info.type === 'M-Type') {
				const addr = parseInt(args[0], 10) || 0;
				operandBinary = addr.toString(2).padStart(4, '0');
			}
			return `${opcode}${operandBinary}`;
		});

		const newMemory = Array(16).fill(0);
		parsedCode.forEach((instr, i) => {
			if (i < newMemory.length) {
				newMemory[i] = parseInt(instr, 2);
			}
		});

		setMemory(newMemory);
		setBinaryInstructions(parsedCode.filter((l) => l.length === 8));
		setMnemonicInstructions(lines);
		setIsRunning(true);
		setPc(0);
		setRegs([0, 0, 0, 0]);
		setZFlag(0);
	};

	const decode = (val: number): string => {
		if (val < 0 || val > 255) return 'NOOP';

		const binary = val.toString(2).padStart(8, '0');
		const opcode = binary.substring(0, 4);
		const instructionInfo =
			INSTRUCTION_SET[opcode as keyof typeof INSTRUCTION_SET];

		if (!instructionInfo) return 'NOOP';

		const { name, type } = instructionInfo;
		if (type === 'R-Type') {
			const rdIdx = parseInt(binary.substring(4, 6), 2);
			const rsIdx = parseInt(binary.substring(6, 8), 2);
			return `${name} ${REG_MAP[rdIdx]}, ${REG_MAP[rsIdx]}`;
		}
		if (type === 'I-Type') {
			const rdIdx = parseInt(binary.substring(4, 6), 2);
			const imm = parseInt(binary.substring(6, 8), 2);
			return `${name} ${REG_MAP[rdIdx]}, ${imm}`;
		}
		if (type === 'M-Type') {
			const addr = parseInt(binary.substring(4, 8), 2);
			return `${name} ${addr}`;
		}

		return 'NOOP';
	};

	const handleReset = () => {
		setIsRunning(false);
		setPc(0);
		setRegs([0, 0, 0, 0]);
		setMemory(Array(16).fill(0));
		setZFlag(0);
		setBinaryInstructions([]);
		setMnemonicInstructions([]);
	};

	const handleStep = () => {
		if (pc >= binaryInstructions.length) return;

		const instruction = binaryInstructions[pc];
		const opcode = instruction.substring(0, 4);
		const instructionInfo =
			INSTRUCTION_SET[opcode as keyof typeof INSTRUCTION_SET];
		if (!instructionInfo) {
			setPc(pc + 1);
			return;
		}

		const newRegs = [...regs];
		const newMemory = [...memory];
		let nextPc = pc + 1;
		let newZFlag = zFlag;

		const type = instructionInfo.type;
		if (type === 'R-Type') {
			const rdIdx = parseInt(instruction.substring(4, 6), 2);
			const rsIdx = parseInt(instruction.substring(6, 8), 2);
			switch (instructionInfo.name) {
				case 'MOVE':
					newRegs[rdIdx] = newRegs[rsIdx];
					break;
				case 'ADD':
					newRegs[rdIdx] += newRegs[rsIdx];
					newZFlag = newRegs[rdIdx] === 0 ? 1 : 0;
					break;
				case 'SUB':
					newRegs[rdIdx] -= newRegs[rsIdx];
					newZFlag = newRegs[rdIdx] === 0 ? 1 : 0;
					break;
			}
		} else if (type === 'I-Type') {
			const rdIdx = parseInt(instruction.substring(4, 6), 2);
			const imm = parseInt(instruction.substring(6, 8), 2);
			switch (instructionInfo.name) {
				case 'LDI':
					newRegs[rdIdx] = imm;
					break;
				case 'ADDI':
					newRegs[rdIdx] += imm;
					newZFlag = newRegs[rdIdx] === 0 ? 1 : 0;
					break;
				case 'SUBI':
					newRegs[rdIdx] -= imm;
					newZFlag = newRegs[rdIdx] === 0 ? 1 : 0;
					break;
			}
		} else if (type === 'M-Type') {
			const addr = parseInt(instruction.substring(4, 8), 2);
			switch (instructionInfo.name) {
				case 'LOAD':
					newRegs[REGISTERS.R0] = newMemory[addr];
					break;
				case 'STORE':
					newMemory[addr] = newRegs[REGISTERS.R0];
					break;
				case 'JUMP':
					nextPc = addr;
					break;
				case 'JZ':
					if (zFlag === 1) nextPc = addr;
					break;
			}
		}

		newRegs.forEach((_, i) => {
			newRegs[i] &= 0xff;
		});

		setRegs(newRegs);
		setMemory(newMemory);
		setPc(nextPc);
		setZFlag(newZFlag);
	};

	const toBinary = (num: number, bits: number) =>
		num.toString(2).padStart(bits, '0');

	return {
		code,
		setCode,
		isRunning,
		pc,
		regs,
		memory,
		zFlag,
		handleLoad,
		handleReset,
		handleStep,
		binaryInstructions,
		mnemonicInstructions,
		toBinary,
		decode,
	};
}
