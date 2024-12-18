/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version, prerendered } from '$service-worker';

export const CACHE_RESOURCES = `cache-resources-${version}`;
export const CACHE_IMAGES_CDN = `cache-images`;
export const CACHE_DYNAMIC = `cache-dynamic`;
export const CACHE_TEMPORARY = `cache-temporary`;

export const ASSETS = [...build, ...files];
export const FILES_TO_CACHE = [...ASSETS, ...prerendered];

export const TEMP_CACHE_TTL = 60 * 60 * 4; // 4 hours
export const TEMP_CACHE_REGEXES = [/^\/app\/v2\/series\/[^/]+\/aggregate$/, /^\/app\/v2\/series$/];
export const TEMP_CACHE_HEADER_NAME = 'SW-Cache-Expires';
