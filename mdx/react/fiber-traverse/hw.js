// 이 스크립트는 리액트의 커밋 단계에서 사용되는 트리 순회 알고리즘을 보여줍니다.
// `useEffect`와 같은 수동적(passive) 이펙트에 대한 로직이며, 순회 로직에만 집중할 수 있도록 단순화되었습니다.
// 이 파일을 실행하려면: node <파일 경로>

// --- 1. 단순화된 파이버 노드 구조를 정의하고 샘플 트리를 생성합니다 ---
// 리액트에서 파이버(Fiber)는 컴포넌트에 대한 정보를 담고 있는 자바스크립트 객체입니다.
// 이 데모에서는 트리 순회에 필요한 포인터만 사용합니다:
// - child: 첫 번째 자식 파이버를 가리킵니다.
// - sibling: 다음 형제 파이버를 가리킵니다.
// - return: 부모 파이버를 가리킵니다.

console.log('--- 샘플 파이버 트리 생성 중 ---');
// 순회할 트리 구조:
//      A
//     / \
//    B   C
//   /   / \
//  D   E   F

const A = { name: 'A', child: null, sibling: null, return: null };
const B = { name: 'B', child: null, sibling: null, return: null };
const C = { name: 'C', child: null, sibling: null, return: null };
const D = { name: 'D', child: null, sibling: null, return: null };
const E = { name: 'E', child: null, sibling: null, return: null };
const F = { name: 'F', child: null, sibling: null, return: null };

// 노드들을 연결하여 트리를 구성합니다.
A.child = B;
B.return = A;
B.sibling = C;
C.return = A;

B.child = D;
D.return = B;

C.child = E;
E.return = C;
E.sibling = F;
F.return = C;

console.log('트리가 생성되었습니다. 순회의 시작점(루트)은 A 입니다.');
console.log(
	'이제 A부터 시작하여 트리를 후위 순회(post-order traversal) 합니다.',
);
console.log('자식의 작업이 모두 완료되어야 부모의 작업이 완료될 수 있습니다.');
console.log('-------------------------------------\n');

// --- 2. 리액트 소스 코드에서 가져온 순회 로직 ---

// 이 전역 변수는 항상 다음에 처리할 파이버를 가리킵니다.
let nextEffect = null;

/**
 * 순회를 위한 주 진입점입니다. `export` 키워드는 원본 스니펫에서 가져왔지만,
 * 간단한 스크립트로 실행할 수 있도록 주석 처리했습니다.
 * @param {object} finishedWork 순회할 파이버 트리(또는 서브 트리)의 루트입니다.
 */
// export
function commitPassiveMountEffects(finishedWork) {
	nextEffect = finishedWork;
	commitPassiveMountEffects_begin(finishedWork);
}

/**
 * 이 함수는 순회의 "시작(begin)" 단계를 처리합니다. 즉, 트리를 아래로(깊이 우선) 내려갑니다.
 * @param {object} subtreeRoot 현재 순회의 루트입니다.
 */
function commitPassiveMountEffects_begin(subtreeRoot) {
	while (nextEffect !== null) {
		const fiber = nextEffect;
		const firstChild = fiber.child;

		if (firstChild !== null) {
			// 자식이 있으면, 그 자식으로 이동합니다.
			nextEffect = firstChild;
		} else {
			// 자식이 없다면, 리프 노드에 도달했거나 이미 방문한 부모 노드입니다.
			// 이제 이 파이버에서부터 "완료(complete)" 단계를 시작하며, 위쪽과 옆으로 이동합니다.
			commitPassiveMountEffects_complete(subtreeRoot);
		}
	}
}

/**
 * 이 함수는 "완료(complete)" 단계를 처리합니다. 즉, 노드를 처리한 후
 * 형제 노드로 이동하고, 형제 노드가 없으면 부모 노드로 이동합니다.
 * @param {object} subtreeRoot 현재 순회의 루트입니다.
 */
function commitPassiveMountEffects_complete(subtreeRoot) {
	while (nextEffect !== null) {
		const fiber = nextEffect;

		// 여기가 "완료" 단계의 "작업(work)" 부분입니다. 리액트에서는
		// 이 시점에서 해당 파이버의 `useEffect`와 같은 수동적 이펙트가 실행됩니다.
		console.log(`✅ ${fiber.name} 노드 작업 완료`);

		// 만약 처음에 시작했던 서브 트리 전체에 대한 작업이 완료되면, 모든 과정이 끝난 것입니다.
		if (fiber === subtreeRoot) {
			nextEffect = null;
			return;
		}

		const sibling = fiber.sibling;
		if (sibling !== null) {
			// 형제 노드가 있으면, 그쪽으로 이동합니다. 함수는 반환되고,
			// `commitPassiveMountEffects_begin`의 메인 루프가 형제의 서브 트리를
			// 아래로 순회하는 작업을 이어받습니다.
			nextEffect = sibling;
			return;
		}

		// 형제 노드가 없으면, 부모 노드로 이동하여 부모를 완료하기 위해 루프를 계속합니다.
		nextEffect = fiber.return;
	}
}

// --- 3. 순회 시작 ---
commitPassiveMountEffects(A);
