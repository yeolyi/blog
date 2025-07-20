'use client';

import { Eye, Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useMemory } from './hooks/useMemory';

export function Memory() {
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
		<div className='flex flex-col gap-4'>
			<form onSubmit={onSubmit}>
				<Card>
					<CardHeader>
						<CardTitle>메모리 시뮬레이터</CardTitle>
						<CardDescription>주소를 사용해 데이터를 읽고 써보세요.</CardDescription>
					</CardHeader>
					<CardContent className='flex flex-col gap-6'>
						<Table className='border'>
							<TableHeader>
								<TableRow>
									<TableHead>주소</TableHead>
									<TableHead>데이터</TableHead>
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
								<Label>동작</Label>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='outline' className='w-[100px]'>
											{operation === 'read' ? '읽기' : '쓰기'}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem onSelect={() => setOperation('read')}>
											읽기
										</DropdownMenuItem>
										<DropdownMenuItem onSelect={() => setOperation('write')}>
											쓰기
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							<div className='flex flex-col gap-1.5'>
								<Label>주소</Label>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='outline' className='w-[120px]'>
											{selectedAddress}번 주소
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
									<Label htmlFor='data'>데이터</Label>
									<Input
										name='data'
										type='number'
										min='0'
										max='255'
										className='w-24'
										placeholder='0~255'
										required
									/>
								</div>
							)}
							<Button type='submit' className='self-end'>
								{operation === 'read' ? <Eye /> : <Pencil />}
								실행
							</Button>
						</div>
					</CardContent>
					<CardFooter>
						{operation === 'read' && (
							<p>
								{lastReadAddress ?? ' - '}번 주소의 값은 {readValue ?? ' - '}
								입니다.
							</p>
						)}
					</CardFooter>
				</Card>
			</form>
		</div>
	);
}
