import { vi } from 'vitest';
import localforage from 'localforage';

// Global mock for localforage
vi.mock('localforage', () => ({
	default: {
		setDriver: vi.fn(),
		getItem: vi.fn().mockResolvedValue(null), // Default to null
		setItem: vi.fn(),
	},
}));
