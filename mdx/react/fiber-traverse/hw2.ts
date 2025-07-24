type FiberNode = {
	val: number;
	childNode: FiberNode | null;
	siblingNode: FiberNode | null;
	returnNode: FiberNode | null;
};

export function traverse(node: FiberNode): Array<number> {
	const arr = [node.val];
	if (node.childNode) arr.push(...traverse(node.childNode));
	arr.push(node.val);
	if (node.siblingNode) arr.push(...traverse(node.siblingNode));
	return arr;
}
