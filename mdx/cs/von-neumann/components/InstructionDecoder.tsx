'use client';

import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '../../../../components/ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../../../components/ui/card';
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger,
} from '../../../../components/ui/responsive-dialog';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '../../../../components/ui/tabs';
import { InstructionSetTable } from './InstructionSetTable';

const INSTRUCTIONS = [
	'MOVE',
	'ADD',
	'SUB',
	'ADDI',
	'SUBI',
	'LDI',
	'LOAD',
	'STORE',
	'JUMP',
	'JZ',
] as const;

type InstructionName = (typeof INSTRUCTIONS)[number];

type ControlSignalInfo = {
	name: string;
	descriptionKey:
		| 'descriptionMove'
		| 'descriptionAdd'
		| 'descriptionSub'
		| 'descriptionAddi'
		| 'descriptionSubi'
		| 'descriptionLdi'
		| 'descriptionLoad'
		| 'descriptionStore'
		| 'descriptionJump'
		| 'descriptionJz';
	signals: {
		register: string;
		memory: string;
		alu: string;
	};
};

const CONTROL_SIGNAL_DETAILS: Record<InstructionName, ControlSignalInfo> = {
	MOVE: {
		name: 'MOVE Rd, Rs',
		descriptionKey: 'descriptionMove',
		signals: {
			register: 'signalRegisterMove',
			memory: 'notUsed',
			alu: 'notUsed',
		},
	},
	ADD: {
		name: 'ADD Rd, Rs',
		descriptionKey: 'descriptionAdd',
		signals: {
			register: 'signalRegisterAddSub',
			memory: 'notUsed',
			alu: 'signalAluAdd',
		},
	},
	SUB: {
		name: 'SUB Rd, Rs',
		descriptionKey: 'descriptionSub',
		signals: {
			register: 'signalRegisterAddSub',
			memory: 'notUsed',
			alu: 'signalAluSub',
		},
	},
	ADDI: {
		name: 'ADDI Rd, Imm',
		descriptionKey: 'descriptionAddi',
		signals: {
			register: 'signalRegisterAddiSubi',
			memory: 'notUsed',
			alu: 'signalAluAdd',
		},
	},
	SUBI: {
		name: 'SUBI Rd, Imm',
		descriptionKey: 'descriptionSubi',
		signals: {
			register: 'signalRegisterAddiSubi',
			memory: 'notUsed',
			alu: 'signalAluSub',
		},
	},
	LDI: {
		name: 'LDI Rd, Imm',
		descriptionKey: 'descriptionLdi',
		signals: {
			register: 'signalRegisterLdi',
			memory: 'notUsed',
			alu: 'notUsed',
		},
	},
	LOAD: {
		name: 'LOAD Addr',
		descriptionKey: 'descriptionLoad',
		signals: {
			register: 'signalRegisterLoad',
			memory: 'signalMemoryLoad',
			alu: 'notUsed',
		},
	},
	STORE: {
		name: 'STORE Addr',
		descriptionKey: 'descriptionStore',
		signals: {
			register: 'signalRegisterStore',
			memory: 'signalMemoryStore',
			alu: 'notUsed',
		},
	},
	JUMP: {
		name: 'JUMP Addr',
		descriptionKey: 'descriptionJump',
		signals: {
			register: 'signalRegisterJump',
			memory: 'notUsed',
			alu: 'notUsed',
		},
	},
	JZ: {
		name: 'JZ Addr',
		descriptionKey: 'descriptionJz',
		signals: {
			register: 'signalRegisterJz',
			memory: 'notUsed',
			alu: 'notUsed',
		},
	},
};

export function InstructionDecoder() {
	const t = useTranslations('VonNeumann.InstructionDecoder');
	const tSet = useTranslations('VonNeumann.InstructionSetTable');
	const tSim = useTranslations('VonNeumann.Simulator');

	return (
		<ResponsiveDialog>
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>{t('title')}</CardTitle>
					<CardDescription>{t('description')}</CardDescription>
					<CardAction>
						<ResponsiveDialogTrigger asChild>
							<Button variant='ghost' size='icon' className='-mr-2'>
								<Info className='h-4 w-4' />
								<span className='sr-only'>{tSim('instructionSetInfo')}</span>
							</Button>
						</ResponsiveDialogTrigger>
					</CardAction>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue='MOVE' className='w-full'>
						<TabsList>
							{INSTRUCTIONS.map((inst) => (
								<TabsTrigger key={inst} value={inst}>
									{inst}
								</TabsTrigger>
							))}
						</TabsList>
						{INSTRUCTIONS.map((inst) => {
							const selectedInfo = CONTROL_SIGNAL_DETAILS[inst];
							return (
								<TabsContent key={inst} value={inst} className='mt-4'>
									<div className='p-4 border'>
										<h3 className='mb-3 font-semibold text-lg'>{selectedInfo.name}</h3>
										<p className='text-sm text-muted-foreground mb-4'>
											{tSet(selectedInfo.descriptionKey)}
										</p>

										<div className='space-y-3 text-sm'>
											<div className='flex items-start'>
												<span className='w-24 shrink-0'>{t('register')}</span>
												<span className='text-muted-foreground'>
													{/* @ts-expect-error 동적 문자열 타입 추론 문제 */}
													{t(selectedInfo.signals.register)}
												</span>
											</div>
											<div className='flex items-start'>
												<span className='w-24 shrink-0'>{t('memory')}</span>
												<span className='text-muted-foreground'>
													{/* @ts-expect-error 동적 문자열 타입 추론 문제 */}
													{t(selectedInfo.signals.memory)}
												</span>
											</div>
											<div className='flex items-start'>
												<span className='w-24 shrink-0'>{t('alu')}</span>
												<span className='text-muted-foreground'>
													{/* @ts-expect-error 동적 문자열 타입 추론 문제 */}
													{t(selectedInfo.signals.alu)}
												</span>
											</div>
										</div>
									</div>
								</TabsContent>
							);
						})}
					</Tabs>
				</CardContent>
			</Card>
			<ResponsiveDialogContent>
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>{tSim('instructionSetInfo')}</ResponsiveDialogTitle>
				</ResponsiveDialogHeader>
				<InstructionSetTable />
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
