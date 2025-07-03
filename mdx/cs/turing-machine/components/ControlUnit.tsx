'use client';

import clsx from 'clsx';
import { Check, ChevronDown, ChevronUp, Pencil, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import type {
	Rules,
	State,
	TapeSymbol,
} from '@/mdx/cs/turing-machine/hooks/turingMachineStore';

export const ControlUnit = ({
	rules,
	currentState,
	currentSymbol,
	editable,
	rulesCsv,
	onRulesCsvChange,
	isEditing,
	setIsEditing,
}: {
	rules: Rules;
	currentState: State;
	currentSymbol: TapeSymbol;
	editable?: boolean;
	rulesCsv: string;
	onRulesCsvChange: (newCsv: string) => void;
	isEditing: boolean;
	setIsEditing: Dispatch<SetStateAction<boolean>>;
}) => {
	const t = useTranslations('TuringMachine.ControlUnit');
	const [isExpanded, setIsExpanded] = useState(false);
	const [hasScroll, setHasScroll] = useState(false);
	const [editedCsv, setEditedCsv] = useState(rulesCsv.trim());

	const handleApply = () => {
		onRulesCsvChange(editedCsv);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditedCsv(rulesCsv.trim());
		setIsEditing(false);
	};

	return (
		<div className='mt-6'>
			<div className='flex mb-2 w-full items-center justify-between'>
				<p className='text-md font-semibold'>{t('title')}</p>
				<div className='flex items-center gap-2'>
					{editable && !isEditing && (
						<Button
							variant='secondary'
							size='icon'
							onClick={() => setIsEditing(true)}
						>
							<Pencil />
						</Button>
					)}
					{hasScroll && !isEditing && (
						<Button
							variant='secondary'
							size='icon'
							onClick={() => setIsExpanded((prev) => !prev)}
						>
							{isExpanded ? <ChevronUp /> : <ChevronDown />}
						</Button>
					)}
				</div>
			</div>
			{isEditing ? (
				<div className='flex flex-col gap-2'>
					<textarea
						className='w-full h-48 p-2 font-mono text-sm bg-stone-900 border border-stone-700 rounded-none focus:outline-none focus:ring-1 focus:ring-green-500'
						value={editedCsv}
						onChange={(e) => setEditedCsv(e.target.value)}
					/>
					<div className='flex items-center justify-end gap-2'>
						<Button variant='destructive' size='icon' onClick={handleCancel}>
							<X />
						</Button>
						<Button variant='default' size='icon' onClick={handleApply}>
							<Check />
						</Button>
					</div>
				</div>
			) : (
				<div
					className={clsx('overflow-auto', !isExpanded && 'h-fit max-h-72')}
					style={{ scrollbarGutter: 'stable' }}
					ref={(ref) => {
						if (ref) {
							setHasScroll(ref.scrollHeight > 288);
						}
					}}
				>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='font-mono bg-stone-900'>
									{t('currentState')}
								</TableHead>
								<TableHead className='font-mono bg-stone-900'>
									{t('readSymbol')}
								</TableHead>
								<TableHead className='font-mono bg-stone-900'>
									{t('nextState')}
								</TableHead>
								<TableHead className='font-mono bg-stone-900'>
									{t('writeSymbol')}
								</TableHead>
								<TableHead className='font-mono bg-stone-900'>{t('move')}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Object.entries(rules).flatMap(([state, transitions]) =>
								Object.entries(transitions).map(
									([symbol, rule]) =>
										rule && (
											<TableRow
												key={`${state}-${symbol}`}
												className={clsx({
													'bg-secondary text-secondary-foreground':
														state === currentState &&
														symbol === currentSymbol &&
														currentState !== 'q-halt',
												})}
											>
												<TableCell className='font-mono'>{state}</TableCell>
												<TableCell className='font-mono'>{symbol}</TableCell>
												<TableCell className='font-mono'>{rule.newState}</TableCell>
												<TableCell className='font-mono'>{rule.newSymbol}</TableCell>
												<TableCell className='font-mono'>{rule.direction}</TableCell>
											</TableRow>
										),
								),
							)}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
};
