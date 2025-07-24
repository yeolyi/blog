'use client';

import { Eye, Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../../components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../../../components/ui/table';
import { useMemory } from './hooks/useMemory';

export function Memory() {
	const t = useTranslations('VonNeumann.Memory');
	const { memory, handleWrite, handleRead, readValue, lastReadAddress } =
		useMemory();

	const [operation, setOperation] = useState<'read' | 'write'>('read');
	const [selectedAddress, setSelectedAddress] = useState(0);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;

		if (operation === 'read') {
			handleRead(selectedAddress);
		} else {
			const formData = new FormData(form);
			const data = formData.get('data') as string;

			if (!data) {
				toast.error('데이터를 입력하세요.');
				return;
			}

			const result = handleWrite(selectedAddress, Number.parseInt(data, 10));

			if (!result.success) {
				toast.error(result.message);
			}
		}
	};

	return (
		<form onSubmit={onSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>{t('title')}</CardTitle>
					<CardDescription>{t('description')}</CardDescription>
				</CardHeader>
				<CardContent className='flex flex-col gap-6'>
					<Table className='border'>
						<TableHeader>
							<TableRow>
								<TableHead>{t('address')}</TableHead>
								<TableHead>{t('data')}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{memory.map((value, index) => (
								<TableRow
									key={index}
									data-active={index === selectedAddress}
									className='data-[active=true]:bg-primary/20'
								>
									<TableCell>{index}</TableCell>
									<TableCell>{value}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					<div className='flex flex-row items-end gap-2 flex-wrap'>
						<div className='flex flex-col gap-1.5'>
							<Label>{t('operation')}</Label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='outline' className='w-[100px]'>
										{operation === 'read' ? t('read') : t('write')}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem onSelect={() => setOperation('read')}>
										{t('read')}
									</DropdownMenuItem>
									<DropdownMenuItem onSelect={() => setOperation('write')}>
										{t('write')}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className='flex flex-col gap-1.5'>
							<Label>{t('address')}</Label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='outline' className='w-[120px]'>
										{t('addressUnit', { address: selectedAddress })}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									{memory.map((_, index) => (
										<DropdownMenuItem
											key={index}
											onSelect={() => setSelectedAddress(index)}
										>
											{index}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{operation === 'write' && (
							<div className='flex flex-col gap-1.5'>
								<Label htmlFor='data'>{t('data')}</Label>
								<Input
									name='data'
									type='number'
									min='0'
									max='255'
									className='w-24'
									placeholder={t('dataPlaceholder')}
									required
								/>
							</div>
						)}
						<Button type='submit' className='self-end'>
							{operation === 'read' ? <Eye /> : <Pencil />}
							{t('submit')}
						</Button>
					</div>
				</CardContent>
				<CardFooter>
					{operation === 'read' && (
						<p>
							{t('readResult', {
								address: lastReadAddress ?? '-',
								value: readValue ?? '-',
							})}
						</p>
					)}
				</CardFooter>
			</Card>
		</form>
	);
}
