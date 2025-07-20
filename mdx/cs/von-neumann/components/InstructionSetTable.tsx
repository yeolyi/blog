'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../../../components/ui/table';
import { INSTRUCTION_SET } from './instructionSet';

export function InstructionSetTable() {
	return (
		<div className='my-6 overflow-x-auto not-prose'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Opcode</TableHead>
						<TableHead>Mnemonic</TableHead>
						<TableHead>피연산자</TableHead>
						<TableHead>설명</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Object.entries(INSTRUCTION_SET)
						.sort((a, b) => a[0].localeCompare(b[0]))
						.map(([code, { name, desc, operand }]) => (
							<TableRow key={code}>
								<TableCell className='font-mono'>{code}</TableCell>
								<TableCell>{name}</TableCell>
								<TableCell>
									{operand === 'value' ? '값' : operand === 'address' ? '주소' : '-'}
								</TableCell>
								<TableCell>{desc}</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
	);
}
