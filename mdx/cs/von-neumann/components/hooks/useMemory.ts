import { useState } from 'react';

type UseMemoryProps = {
	max_value?: number;
};

const MAX_VALUE = 256;

export function useMemory({ max_value = MAX_VALUE }: UseMemoryProps = {}) {
	const [memory, setMemory] = useState([314, 159, 265, 358]);
	const [readValue, setReadValue] = useState<number | null>(null);
	const [lastReadAddress, setLastReadAddress] = useState<number | null>(null);
	const [lastWriteAddress, setLastWriteAddress] = useState<number | null>(null);

	const handleWrite = (address: number, data: number) => {
		if (
			!Number.isNaN(address) &&
			!Number.isNaN(data) &&
			address >= 0 &&
			address < memory.length &&
			data >= 0 &&
			data < max_value
		) {
			const newMemory = [...memory];
			newMemory[address] = data;
			setMemory(newMemory);
			setLastWriteAddress(address);
			setLastReadAddress(null);
			setReadValue(null);
			return { success: true };
		}
		return {
			success: false,
			message: `유효한 주소(0-${
				memory.length - 1
			})와 데이터(0-${max_value - 1})를 입력하세요.`,
		};
	};

	const handleRead = (address: number) => {
		if (!Number.isNaN(address) && address >= 0 && address < memory.length) {
			setLastReadAddress(address);
			setReadValue(memory[address]);
			setLastWriteAddress(null);
		} else {
			alert(`유효한 주소(0-${memory.length - 1})를 입력하세요.`);
			setLastReadAddress(null);
			setReadValue(null);
		}
	};

	return {
		memory,
		readValue,
		lastReadAddress,
		lastWriteAddress,
		handleWrite,
		handleRead,
	};
}
