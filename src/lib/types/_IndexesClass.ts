class _IndexesClass {
	title: string = '';

	_indexes: Index[] = [];

	get indexes(): Index[] {
		// we cache the indexes so we don't have to recalculate them every time, especially since they're constant
		if (this._indexes && this._indexes.length > 0) return this._indexes;

		const index = ['Arc', 'Chapter', 'Volume', 'Part', 'Book', 'Fanbook'] as const;
		const regexes = {
			Arc: /Arc (\d+)/,
			Chapter: /Chapter (\d+)/,
			Volume: /(?:Volume|Vol.) (\d+)/,
			Part: /Part (\d+)/,
			Book: /Book (\d+)/,
			Fanbook: /Fanbook (\d+)/,
		};
		const indexes: Index[] = [];
		for (const key of index) {
			const match = this.title.match(regexes[key]);
			if (match) {
				indexes.push({
					index: match.index!,
					value: match[1],
					fullName: key,
					name: key[0],
					match: match,
				});
			}
		}
		indexes.sort((a, b) => a.index - b.index);
		this._indexes = indexes;

		return indexes;
	}

	getIndexes(): string {
		return this.indexes.map((i) => `${i.name}. ${i.value}`).join(' ');
	}

	getFullIndexes(): string {
		return this.indexes.map((i) => `${i.fullName} ${i.value}`).join(' ');
	}

	getTitleWithoutIndexes(): string {
		const indexes = this.indexes;
		const earliestIndex = indexes.length > 0 ? indexes[0].index : this.title.length;
		return this.title.slice(0, earliestIndex).trim().replace(/:$/, '');
	}
}

export type Index = {
	index: number;
	value: string;
	name: string;
	fullName: string;
	match: RegExpMatchArray;
};

export default _IndexesClass;
