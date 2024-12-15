/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;
import { build, files, version, prerendered } from '$service-worker';

export const CACHE_RESOURCES = `cache-resources-${version}`;
export const CACHE_IMAGES_CDN = `cache-images`;
export const CACHE_DYNAMIC = `cache-dynamic`;

export const ASSETS = [...build, ...files];
export const FILES_TO_CACHE = [...ASSETS, ...prerendered];
