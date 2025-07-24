'use client';

import { Info, Play, RotateCcw, StepForward } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog';
import { InstructionSetTable } from '@/mdx/cs/von-neumann/components/InstructionSetTable';
import { Button } from '../../../../components/ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../../../components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../../../components/ui/table';
import { Textarea } from '../../../../components/ui/textarea';
import { cn } from '../../../../lib/utils';
import { REG_MAP, useVonNeumann } from './hooks/useVonNeumann';

type MemoryViewerProps = {
	memory: number[];
	pc: number;
	decode: (val: number) => string;
	toBinary: (num: number, bits: number) => string;
};

function MemoryViewer({ memory, pc, decode, toBinary }: MemoryViewerProps) {
	const t = useTranslations('VonNeumann.Simulator');
	return (
		<div>
			<div className='mb-1'>{t('memory')}</div>
			<div className='border h-[340px] overflow-y-auto'>
				<Table className='font-mono'>
					<TableHeader>
						<TableRow>
							<TableHead>{t('address')}</TableHead>
							<TableHead>{t('valueBinary')}</TableHead>
							<TableHead>{t('valueDecimal')}</TableHead>
							<TableHead>{t('assembly')}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{memory.map((val, idx) => (
							<TableRow
								key={idx}
								className={cn(idx === pc && 'bg-blue-100 dark:bg-blue-900/50')}
							>
								<TableCell>{toBinary(idx, 4)}</TableCell>
								<TableCell>{toBinary(val, 8)}</TableCell>
								<TableCell>{val}</TableCell>
								<TableCell>{decode(val)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

export function VonNeumannSimulator() {
	const {
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
		toBinary,
		decode,
	} = useVonNeumann();
	const t = useTranslations('VonNeumann.Simulator');

	return (
		<ResponsiveDialog>
			<Card>
				<CardHeader>
					<CardTitle>{t('title')}</CardTitle>
					<CardAction>
						<ResponsiveDialogTrigger asChild>
							<Button variant='ghost' size='icon' className='-mr-2'>
								<Info className='h-4 w-4' />
								<span className='sr-only'>{t('instructionSetInfo')}</span>
							</Button>
						</ResponsiveDialogTrigger>
					</CardAction>
				</CardHeader>

				<CardContent className='flex flex-col gap-6'>
					{/* Code and Controls */}
					<div className='flex flex-col gap-4'>
						{!isRunning ? (
							<div>
								<label htmlFor='code-input'>{t('instructions')}</label>
								<Textarea
									id='code-input'
									value={code}
									onChange={(e) => setCode(e.target.value)}
									disabled={isRunning}
									rows={16}
									className='mt-1 whitespace-nowrap'
									placeholder={t('placeholder')}
								/>
							</div>
						) : (
							<MemoryViewer
								memory={memory}
								pc={pc}
								decode={decode}
								toBinary={toBinary}
							/>
						)}
						<div className='flex flex-col gap-2'>
							{!isRunning ? (
								<Button onClick={handleLoad} className='w-full'>
									<Play className='w-4 h-4 mr-2' /> {t('loadProgram')}
								</Button>
							) : (
								<>
									<Button
										onClick={handleStep}
										disabled={pc >= binaryInstructions.length}
										className='w-full'
									>
										<StepForward className='w-4 h-4 mr-2' /> {t('step')}
									</Button>
									<Button onClick={handleReset} variant='outline'>
										<RotateCcw className='w-4 h-4 mr-2' /> {t('reset')}
									</Button>
								</>
							)}
						</div>
					</div>

					{/* CPU and Memory State */}
					<div className='space-y-6'>
						<div>
							<h3 className='font-semibold'>{t('cpuState')}</h3>
							<div className='space-y-3 mt-2'>
								<div className='flex justify-between items-center'>
									<span className='text-sm'>{t('pc')}</span>
									<span className='font-mono text-sm'>
										{toBinary(pc, 8)} ({pc})
									</span>
								</div>
								<div className='flex justify-between items-center'>
									<span className='text-sm'>Z (Zero Flag)</span>
									<span
										className={cn(
											'font-mono text-sm',
											zFlag && 'text-green-500 font-bold',
										)}
									>
										{zFlag}
									</span>
								</div>
								{regs.map((val, idx) => (
									<div key={idx} className='flex justify-between items-center'>
										<span className='text-sm'>
											{t('register')} {REG_MAP[idx]}
										</span>
										<span className='font-mono text-sm'>
											{toBinary(val, 8)} ({val})
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<ResponsiveDialogContent>
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>{t('instructionSetInfo')}</ResponsiveDialogTitle>
				</ResponsiveDialogHeader>
				<InstructionSetTable />
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
