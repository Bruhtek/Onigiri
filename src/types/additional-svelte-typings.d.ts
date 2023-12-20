declare namespace svelteHTML {
	// enhance attributes
	interface HTMLAttributes<T> {
		'on:swipeLeft'?: (event: any) => any;
		'on:swipeRight'?: (event: any) => any;
	}
}