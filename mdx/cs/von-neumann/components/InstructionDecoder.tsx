'use client';

import { Lightbulb, Zap } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '../../../../components/ui/badge';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { cn } from '../../../../lib/utils';
import { INSTRUCTION_SET } from './instructionSet';

const EXAMPLE_INSTRUCTIONS = [
	'00010110', // LOAD_A 6
	'01010100', // STORE_A at addr 4
	'01100101', // STORE_B at addr 5
	'01111001', // LOAD_A_MEM from addr 9
];

export function InstructionDecoder() {
	const [binary, setBinary] = useState('00010110');

	const opcode = binary.substring(0, 4);
	const operandBinary = binary.substring(4);
	const operandDecimal = parseInt(operandBinary, 2) || 0;

	const instructionInfo = INSTRUCTION_SET[opcode];
	const hasOperand = instructionInfo?.operand !== 'none';

	const controlSignals = {
		alu: '-',
		memory: '-',
		register: '-',
	};

	if (instructionInfo) {
		switch (instructionInfo.name) {
			case 'LOAD_A':
				controlSignals.register = `피연산자 값(${operandDecimal})을 레지스터 A에 저장`;
				break;
			case 'LOAD_B':
				controlSignals.register = `피연산자 값(${operandDecimal})을 레지스터 B에 저장`;
				break;
			case 'ADD':
				controlSignals.alu = 'ADD 연산 수행';
				controlSignals.register =
					'레지스터 A, B 값을 ALU로 보내고, 결과를 다시 레지스터 A에 저장';
				break;
			case 'SUB':
				controlSignals.alu = 'SUB 연산 수행';
				controlSignals.register =
					'레지스터 A, B 값을 ALU로 보내고, 결과를 다시 레지스터 A에 저장';
				break;
			case 'NAND':
				controlSignals.alu = 'NAND 연산 수행';
				controlSignals.register =
					'레지스터 A, B 값을 ALU로 보내고, 결과를 다시 레지스터 A에 저장';
				break;
			case 'STORE_A':
				controlSignals.memory = `주소 ${operandDecimal}에 데이터 쓰기 (WRITE)`;
				controlSignals.register = '레지스터 A 값을 데이터 버스로 전송';
				break;
			case 'STORE_B':
				controlSignals.memory = `주소 ${operandDecimal}에 데이터 쓰기 (WRITE)`;
				controlSignals.register = '레지스터 B 값을 데이터 버스로 전송';
				break;
			case 'LOAD_A_MEM':
				controlSignals.memory = `주소 ${operandDecimal}에서 데이터 읽기 (READ)`;
				controlSignals.register = '메모리로부터 읽은 값을 레지스터 A에 저장';
				break;
			case 'LOAD_B_MEM':
				controlSignals.memory = `주소 ${operandDecimal}에서 데이터 읽기 (READ)`;
				controlSignals.register = '메모리로부터 읽은 값을 레지스터 B에 저장';
				break;
		}
	} else {
		const invalidMsg = '유효하지 않은 명령어';
		controlSignals.alu = invalidMsg;
		controlSignals.memory = invalidMsg;
		controlSignals.register = invalidMsg;
	}

	return (
		<div className='my-8 not-prose'>
			<Card>
				<CardHeader>
					<CardTitle>제어 장치 시뮬레이터</CardTitle>
				</CardHeader>
				<CardContent className='flex flex-col gap-6'>
					<div>
						<label htmlFor='binary-input' className='font-semibold text-sm'>
							8비트 이진수 명령어
						</label>
						<Input
							id='binary-input'
							value={binary}
							onChange={(e) => {
								const val = e.target.value.replace(/[^01]/g, '');
								if (val.length <= 8) setBinary(val);
							}}
							maxLength={8}
							className='font-mono text-lg tracking-widest mt-1'
						/>
						<div className='mt-2 text-xs text-muted-foreground'>
							예시:{' '}
							{EXAMPLE_INSTRUCTIONS.map((inst) => (
								<button
									key={inst}
									type='button'
									onClick={() => setBinary(inst)}
									className='font-mono hover:text-primary transition-colors ml-2'
								>
									{inst}
								</button>
							))}
						</div>
					</div>

					<div className='flex flex-row gap-4 text-center'>
						<div className='flex-1 p-4 border border-border'>
							<div className='text-sm text-muted-foreground'>Opcode (4 bits)</div>
							<div className='font-mono text-2xl tracking-wider p-2'>
								{opcode.padEnd(4, '_')}
							</div>
						</div>
						<div
							className={cn(
								'flex-1 p-4 border border-border',
								!hasOperand && 'opacity-40',
							)}
						>
							<div className='text-sm text-muted-foreground'>
								{hasOperand
									? `피연산자 (${instructionInfo?.operand === 'address' ? '주소' : '값'})`
									: '사용 안함'}
							</div>
							<div className='font-mono text-2xl tracking-wider p-2'>
								{operandBinary.padEnd(4, '_')}
							</div>
						</div>
					</div>

					<div className='p-4 border border-border'>
						<h3 className='font-semibold mb-2 flex items-center'>
							<Lightbulb className='w-4 h-4 mr-2' />
							해석 결과
						</h3>
						{instructionInfo ? (
							<>
								<p>
									<Badge variant='outline'>{instructionInfo.name}</Badge>
									{hasOperand && (
										<span className='font-mono ml-2'>0b{operandBinary || '0000'}</span>
									)}
								</p>
								<p className='text-muted-foreground text-sm mt-2'>
									{instructionInfo.desc}
								</p>
							</>
						) : (
							<p className='text-muted-foreground text-sm'>
								유효하지 않은 Opcode입니다. (첫 4자리를 확인하세요)
							</p>
						)}
					</div>

					<div className='p-4 border border-border'>
						<h3 className='font-semibold mb-2 flex items-center'>
							<Zap className='w-4 h-4 mr-2' />
							지시 사항
						</h3>
						<div className='space-y-2 text-sm'>
							<div>
								<span className='w-20 inline-block font-semibold text-foreground'>
									ALU
								</span>
								<span className='text-muted-foreground'>{controlSignals.alu}</span>
							</div>
							<div>
								<span className='w-20 inline-block font-semibold text-foreground'>
									레지스터
								</span>
								<span className='text-muted-foreground'>{controlSignals.register}</span>
							</div>
							<div>
								<span className='w-20 inline-block font-semibold text-foreground'>
									메모리
								</span>
								<span className='text-muted-foreground'>{controlSignals.memory}</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
