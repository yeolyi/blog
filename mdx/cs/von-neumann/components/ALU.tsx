'use client';

import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../../../components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Separator } from '../../../../components/ui/separator';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../../../components/ui/table';
import { cn } from '../../../../lib/utils';

type Operation = 'ADD' | 'SUB' | 'NAND';

const OPERATIONS: Operation[] = ['ADD', 'SUB', 'NAND'];

type Flags = {
	Z: 0 | 1;
	C: 0 | 1;
	N: 0 | 1;
	V: 0 | 1;
};

const to8bitBinaryString = (n: number): string => {
	if (Number.isNaN(n)) return '00000000';
	// Use bitwise AND to get the 8-bit two's complement representation
	const unsigned = n & 0xff;
	return unsigned.toString(2).padStart(8, '0');
};

const clamp8bitSigned = (n: number): number => {
	const val = Number.isNaN(n) ? 0 : n;
	const min = -128;
	const max = 127;
	return Math.max(min, Math.min(max, Math.trunc(val)));
};

const calculateALUResult = (
	op: Operation,
	valA: number,
	valB: number,
): { result: number; flags: Flags } => {
	const a = clamp8bitSigned(valA);
	const b = clamp8bitSigned(valB);

	let res_s8 = 0;
	const newFlags: Flags = { Z: 0, C: 0, N: 0, V: 0 };

	const a_u8 = a & 0xff;
	const b_u8 = b & 0xff;

	switch (op) {
		case 'ADD': {
			const sum_u8 = (a_u8 + b_u8) & 0xff;
			res_s8 = sum_u8 > 127 ? sum_u8 - 256 : sum_u8;
			newFlags.C = a_u8 + b_u8 > 0xff ? 1 : 0;
			newFlags.V =
				(a > 0 && b > 0 && res_s8 < 0) || (a < 0 && b < 0 && res_s8 > 0) ? 1 : 0;
			break;
		}
		case 'SUB': {
			const diff_u8 = (a_u8 - b_u8) & 0xff;
			res_s8 = diff_u8 > 127 ? diff_u8 - 256 : diff_u8;
			newFlags.C = a_u8 < b_u8 ? 1 : 0; // Borrow
			newFlags.V =
				(a > 0 && b < 0 && res_s8 < 0) || (a < 0 && b > 0 && res_s8 > 0) ? 1 : 0;
			break;
		}
		case 'NAND': {
			const res_u8 = ~(a_u8 & b_u8) & 0xff;
			res_s8 = res_u8 > 127 ? res_u8 - 256 : res_u8;
			break;
		}
	}

	newFlags.Z = res_s8 === 0 ? 1 : 0;
	newFlags.N = res_s8 < 0 ? 1 : 0;

	return { result: res_s8, flags: newFlags };
};

export function ALU() {
	const [op, setOp] = useState<Operation>('ADD');
	const [valA, setValA] = useState(10);
	const [valB, setValB] = useState(5);

	const { result, flags } = calculateALUResult(op, valA, valB);

	return (
		<div className='flex flex-col gap-6'>
			<Card>
				<CardHeader>
					<CardTitle>ALU 시뮬레이터</CardTitle>
				</CardHeader>
				<CardContent className='flex flex-col gap-6'>
					<div className='flex flex-row items-start gap-2 flex-wrap'>
						<div className='flex flex-col gap-1.5'>
							<Label htmlFor='valA'>레지스터 A</Label>
							<Input
								name='valA'
								type='number'
								className='w-28'
								value={valA}
								onChange={(e) => setValA(e.target.valueAsNumber)}
								required
							/>
							<p className='text-xs text-muted-foreground font-mono'>
								0b{to8bitBinaryString(valA)}
							</p>
						</div>

						<div className='flex flex-col gap-1.5'>
							<Label>연산</Label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='outline' className='w-[100px]'>
										{op}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									{OPERATIONS.map((opName) => (
										<DropdownMenuItem key={opName} onSelect={() => setOp(opName)}>
											{opName}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<div className='flex flex-col gap-1.5'>
							<Label htmlFor='valB'>레지스터 B</Label>
							<Input
								name='valB'
								type='number'
								className='w-28'
								value={valB}
								onChange={(e) => setValB(e.target.valueAsNumber)}
								required
							/>
							<p className='text-xs text-muted-foreground font-mono'>
								0b{to8bitBinaryString(valB)}
							</p>
						</div>
					</div>

					<Separator className='my-4' />

					{result !== null && flags && (
						<div className='space-y-4'>
							<div>
								<h3 className='font-semibold'>
									결과: {result}{' '}
									<span className='font-mono text-muted-foreground'>
										(0b{to8bitBinaryString(result)})
									</span>
								</h3>
							</div>
							<div>
								<h3 className='font-semibold mb-2'>상태 플래그</h3>
								<Table className='border w-auto'>
									<TableHeader>
										<TableRow>
											<TableHead>Zero (Z)</TableHead>
											<TableHead>Carry (C)</TableHead>
											<TableHead>Negative (N)</TableHead>
											<TableHead>Overflow (V)</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										<TableRow>
											<TableCell className={cn(flags.Z && 'text-primary font-bold')}>
												{flags.Z}
											</TableCell>
											<TableCell className={cn(flags.C && 'text-primary font-bold')}>
												{flags.C}
											</TableCell>
											<TableCell className={cn(flags.N && 'text-primary font-bold')}>
												{flags.N}
											</TableCell>
											<TableCell className={cn(flags.V && 'text-primary font-bold')}>
												{flags.V}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
