/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import './sw/events';
import './sw/communication/broadcastChannel';

const sw = self as unknown as ServiceWorkerGlobalScope;
