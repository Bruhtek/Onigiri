/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { createStore } from '../lib/helpers/store.svelte';

const sw = self as unknown as ServiceWorkerGlobalScope;

export const ServiceWorkerLifecycles = ['installing', 'active'] as const;
type ServiceWorkerLifecycle = (typeof ServiceWorkerLifecycles)[number];

export const serviceWorkerLifecycle = createStore<ServiceWorkerLifecycle>('installing');
