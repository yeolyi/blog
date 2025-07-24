'use client';

import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// arePropsEqual 비교 함수
// username이 같으면 true를 반환하여 리렌더링을 방지합니다.
// status가 변경되어도 username이 같으면 리렌더링되지 않습니다.
const areUserPropsEqual = (
	prevProps: { username: string; status: string },
	nextProps: { username: string; status: string },
) => {
	console.log('arePropsEqual 호출됨:', { prev: prevProps, next: nextProps });
	const areEqual = prevProps.username === nextProps.username;
	console.log(
		`username만 비교 결과: ${areEqual ? '같음 (리렌더링 방지)' : '다름 (리렌더링!)'}`,
	);
	return areEqual;
};

// 자식 컴포넌트
const UserAvatar = memo(
	({ username, status }: { username: string; status: string }) => {
		console.log(
			`%c🎨 UserAvatar (유저: ${username})가 렌더링되었습니다.`,
			'color: #4CAF50; font-weight: bold;',
		);
		return (
			<Card className='mt-4'>
				<CardHeader>
					<CardTitle>자식 컴포넌트 (Memoized)</CardTitle>
				</CardHeader>
				<CardContent>
					<p>유저명: {username}</p>
					<p>상태: {status}</p>
				</CardContent>
			</Card>
		);
	},
	areUserPropsEqual,
);

UserAvatar.displayName = 'UserAvatar';

// 부모 컴포넌트
export default function ArePropsEqualExample() {
	const [username, setUsername] = useState('Leo');
	const [status, setStatus] = useState('온라인');
	const [unrelatedState, setUnrelatedState] = useState(0);

	console.log('부모 컴포넌트 렌더링');

	return (
		<Card>
			<CardHeader>
				<CardTitle>arePropsEqual 예제</CardTitle>
			</CardHeader>
			<CardContent>
				<div>
					<h3 className='font-bold'>부모 컴포넌트 상태</h3>
					<p>현재 유저명: {username}</p>
					<p>현재 상태: {status}</p>
					<p>관련 없는 상태: {unrelatedState}</p>
				</div>

				<UserAvatar username={username} status={status} />

				<div className='mt-4 flex space-x-2'>
					<Button onClick={() => setUsername(username === 'Leo' ? 'Yi' : 'Leo')}>
						유저명 변경 (자식 리렌더링 O)
					</Button>
					<Button
						onClick={() => setStatus(status === '온라인' ? '오프라인' : '온라인')}
					>
						상태 변경 (자식 리렌더링 X)
					</Button>
					<Button onClick={() => setUnrelatedState((c) => c + 1)}>
						부모만 리렌더링 (자식 리렌더링 X)
					</Button>
				</div>
				<div className='mt-4 rounded border p-4'>
					<p className='font-bold'>실험 방법:</p>
					<ol className='list-inside list-decimal'>
						<li>개발자 도구 콘솔을 엽니다.</li>
						<li>
							'유저명 변경' 버튼을 클릭하면 부모와 자식이 모두 렌더링되고,
							`arePropsEqual`이 `false`를 반환하는 것을 확인하세요.
						</li>
						<li>
							'상태 변경' 버튼을 클릭하면 부모만 렌더링되고, `arePropsEqual`이 `true`를
							반환하여 자식의 렌더링을 막는 것을 확인하세요.
						</li>
						<li>'부모만 리렌더링' 버튼도 마찬가지입니다.</li>
					</ol>
				</div>
			</CardContent>
		</Card>
	);
}
