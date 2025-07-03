type FiberNode = {
	val: number;
	left: FiberNode | null;
	right: FiberNode | null;
	nodeType: 'Normal' | 'Provider' | 'Consumer';
};

// 하위부터 상위로 노드 생성

const node7: FiberNode = {
	val: 7,
	left: null,
	right: null,
	nodeType: 'Consumer',
};
const node10: FiberNode = {
	val: 10,
	left: null,
	right: null,
	nodeType: 'Consumer',
};
const node11: FiberNode = {
	val: 11,
	left: null,
	right: null,
	nodeType: 'Consumer',
};
const node12: FiberNode = {
	val: 12,
	left: null,
	right: null,
	nodeType: 'Provider',
};

const node8: FiberNode = {
	val: 8,
	left: node10,
	right: null,
	nodeType: 'Provider',
};
const node9: FiberNode = {
	val: 9,
	left: node11,
	right: node12,
	nodeType: 'Consumer',
};

const node4: FiberNode = {
	val: 4,
	left: node7,
	right: node8,
	nodeType: 'Normal',
};
const node5: FiberNode = {
	val: 5,
	left: null,
	right: null,
	nodeType: 'Normal',
};
const node6: FiberNode = {
	val: 6,
	left: node9,
	right: null,
	nodeType: 'Provider',
};

const node2: FiberNode = {
	val: 2,
	left: node4,
	right: node5,
	nodeType: 'Provider',
};
const node3: FiberNode = {
	val: 3,
	left: null,
	right: node6,
	nodeType: 'Normal',
};

const root: FiberNode = {
	val: 1,
	left: node2,
	right: node3,
	nodeType: 'Normal',
};

const stack: number[] = [];

const traverse = (node: FiberNode) => {
	if (node.nodeType === 'Normal') {
		console.log(node.val);
	}
	if (node.nodeType === 'Consumer') {
		console.log(stack.at(-1));
	}
	if (node.nodeType === 'Provider') {
		stack.push(node.val);
	}

	if (node.left) traverse(node.left);
	if (node.right) traverse(node.right);

	stack.pop();
};

traverse(root);
