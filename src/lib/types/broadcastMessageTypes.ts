export type DynamicCacheMessage = {
	type: 'DynamicCacheMessage';
} & (
	| {
			action: 'add';
			requestInfo: RequestInfo | URL;
	  }
	| {
			action: 'reset';
	  }
);

export function isDynamicCacheMessage(obj: unknown): obj is DynamicCacheMessage {
	if (typeof obj !== 'object' || obj === null) return false;

	const base = obj as Partial<DynamicCacheMessage>;
	if (base.type !== 'DynamicCacheMessage') return false;

	if (base.action === 'add') {
		return (
			base.requestInfo instanceof Request ||
			typeof base.requestInfo === 'string' ||
			base.requestInfo instanceof URL
		);
	}

	return base.action === 'reset';
}
