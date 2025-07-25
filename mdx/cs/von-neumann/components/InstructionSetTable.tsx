'use client';

import { useTranslations } from 'next-intl';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../../../components/ui/card';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '../../../../components/ui/tabs';

const INSTRUCTION_DETAILS: Record<
	string,
	{
		name: string;
		description: string;
		structure: { label: string; bits: number }[];
		example: string;
		binaryExample: string;
	}
> = {
	MOVE: {
		name: 'MOVE Rd, Rs',
		description: 'descriptionMove',
		structure: [
			{ label: 'Opcode (0000)', bits: 4 },
			{ label: 'Rd', bits: 2 },
			{ label: 'Rs', bits: 2 },
		],
		example: 'MOVE R1, R2  // R1 = R2',
		binaryExample: '00000110',
	},
	ADD: {
		name: 'ADD Rd, Rs',
		description: 'descriptionAdd',
		structure: [
			{ label: 'Opcode (0001)', bits: 4 },
			{ label: 'Rd', bits: 2 },
			{ label: 'Rs', bits: 2 },
		],
		example: 'ADD R0, R1  // R0 = R0 + R1',
		binaryExample: '00010001',
	},
	SUB: {
		name: 'SUB Rd, Rs',
		description: 'descriptionSub',
		structure: [
			{ label: 'Opcode (0010)', bits: 4 },
			{ label: 'Rd', bits: 2 },
			{ label: 'Rs', bits: 2 },
		],
		example: 'SUB R3, R1  // R3 = R3 - R1',
		binaryExample: '00101101',
	},
	ADDI: {
		name: 'ADDI Rd, Imm',
		description: 'descriptionAddi',
		structure: [
			{ label: 'Opcode (0100)', bits: 4 },
			{ label: 'Rd', bits: 2 },
			{ label: 'Imm', bits: 2 },
		],
		example: 'ADDI R1, 2  // R1 = R1 + 2',
		binaryExample: '01000110',
	},
	SUBI: {
		name: 'SUBI Rd, Imm',
		description: 'descriptionSubi',
		structure: [
			{ label: 'Opcode (0101)', bits: 4 },
			{ label: 'Rd', bits: 2 },
			{ label: 'Imm', bits: 2 },
		],
		example: 'SUBI R3, 1  // R3 = R3 - 1',
		binaryExample: '01011101',
	},
	LDI: {
		name: 'LDI Rd, Imm',
		description: 'descriptionLdi',
		structure: [
			{ label: 'Opcode (0110)', bits: 4 },
			{ label: 'Rd', bits: 2 },
			{ label: 'Imm', bits: 2 },
		],
		example: 'LDI R0, 3  // R0 = 3',
		binaryExample: '01100011',
	},
	LOAD: {
		name: 'LOAD Addr',
		description: 'descriptionLoad',
		structure: [
			{ label: 'Opcode (1000)', bits: 4 },
			{ label: 'Addr', bits: 4 },
		],
		example: 'LOAD 10  // R0 = Mem[10]',
		binaryExample: '10001010',
	},
	STORE: {
		name: 'STORE Addr',
		description: 'descriptionStore',
		structure: [
			{ label: 'Opcode (1001)', bits: 4 },
			{ label: 'Addr', bits: 4 },
		],
		example: 'STORE 5  // Mem[5] = R0',
		binaryExample: '10010101',
	},
	JUMP: {
		name: 'JUMP Addr',
		description: 'descriptionJump',
		structure: [
			{ label: 'Opcode (1100)', bits: 4 },
			{ label: 'Addr', bits: 4 },
		],
		example: 'JUMP 3  // 3번 줄로 이동',
		binaryExample: '11000011',
	},
	JZ: {
		name: 'JZ Addr',
		description: 'descriptionJz',
		structure: [
			{ label: 'Opcode (1101)', bits: 4 },
			{ label: 'Addr', bits: 4 },
		],
		example: 'JZ 15  // Z 플래그가 1이면 15번 줄로 이동',
		binaryExample: '11011111',
	},
};

export function InstructionSetTable() {
	const t = useTranslations('VonNeumann.InstructionSetTable');
	const instructionNames = Object.keys(INSTRUCTION_DETAILS);

	return (
		<div>
			<Tabs defaultValue={instructionNames[0]} className='w-full'>
				<TabsList>
					{instructionNames.map((name) => (
						<TabsTrigger key={name} value={name}>
							{name}
						</TabsTrigger>
					))}
				</TabsList>
				{Object.entries(INSTRUCTION_DETAILS).map(([name, details]) => (
					<TabsContent key={name} value={name} className='mt-4'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center justify-between'>
									<span>{details.name}</span>
								</CardTitle>
								{/* @ts-expect-error 동적 문자열 타입 추론 문제 */}
								<CardDescription>{t(details.description)}</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<h4 className='mb-2'>{t('structure')}</h4>
									<div className='flex w-full h-10 border border-border'>
										{details.structure.map((part, idx) => (
											<div
												key={idx}
												className={`flex flex-col items-center justify-center text-center text-xs p-1
                        ${part.bits === 4 ? 'w-1/2' : 'w-1/4'}
                        ${idx > 0 ? 'border-l border-border' : ''}`}
											>
												<span>{part.label}</span>
												<span className='text-muted-foreground'>({part.bits} bits)</span>
											</div>
										))}
									</div>
								</div>
								<div>
									<h4 className='mb-2'>{t('example')}</h4>
									<pre className='p-3 bg-muted leading-relaxed'>
										<code>
											{details.example}
											<br />
											{details.binaryExample}
										</code>
									</pre>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
