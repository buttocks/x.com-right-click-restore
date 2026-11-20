// ==UserScript==
// @name         X.com Right Click Restore
// @namespace    bryan-tools.x-native-image-context-menu
// @version      1.1.0
// @description  Restore native image right-click on X/Twitter and prefer the highest available original-resolution photo.
// @author       Bryan Tools
// @match        https://x.com/*
// @match        https://www.x.com/*
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==

(() => {
    'use strict';

    const PHOTO_CONTAINER = '[data-testid="tweetPhoto"]';
    const PHOTO_IMAGE = 'img[src*="pbs.twimg.com/media/"], img[srcset*="pbs.twimg.com/media/"]';
    const PHOTO_LINK = 'a[href*="/photo/"]';
    const loading = new WeakMap();
    const ready = new WeakMap();

    function originalUrl(raw) {
        if (!raw) return null;
        try {
            const url = new URL(raw, location.href);
            if (url.protocol !== 'https:' || url.hostname !== 'pbs.twimg.com'
                || !url.pathname.startsWith('/media/')) return null;

            // Also handle older URLs like /media/<id>.jpg:small.
            url.pathname = url.pathname.replace(/:(thumb|small|medium|large|orig)$/i, '');
            url.searchParams.set('name', 'orig');
            return url.href;
        } catch {
            return null;
        }
    }

    function findPhotoImage(target) {
        if (!(target instanceof Element)) return null;
        if (target.matches(PHOTO_IMAGE)) return target;

        const parent = target.closest(`${PHOTO_CONTAINER}, ${PHOTO_LINK}`);
        if (parent) return parent.querySelector(PHOTO_IMAGE);

        // The photo viewer sometimes routes pointer events through inner wrappers.
        const nested = target.closest(PHOTO_IMAGE);
        return nested || null;
    }

    function preloadOriginal(img) {
        if (!img || !img.isConnected) return;
        const candidate = originalUrl(img.currentSrc || img.src);
        if (!candidate) return;
        if (ready.get(img) === candidate || loading.get(img) === candidate) return;

        loading.set(img, candidate);
        const loader = new Image();
        loader.decoding = 'async';

        loader.onload = () => {
            if (loading.get(img) !== candidate) return;
            loading.delete(img);
            if (!img.isConnected) return;

            // Let the browser's native "Copy image" target the original
            // rather than X's smaller srcset/currentSrc rendition.
            img.removeAttribute('srcset');
            img.src = candidate;
            ready.set(img, candidate);
        };

        loader.onerror = () => {
            if (loading.get(img) === candidate) loading.delete(img);
            // Keep X's current photo if it has no orig rendition.
        };

        loader.src = candidate;
    }

    // Prepare the original only for photos the user points at, instead of
    // downloading every high-resolution image in the timeline.
    window.addEventListener('pointerover', (event) => {
        preloadOriginal(findPhotoImage(event.target));
    }, { capture: true, passive: true });

    window.addEventListener('pointerdown', (event) => {
        if (event.button !== 2) return;
        preloadOriginal(findPhotoImage(event.target));
    }, { capture: true, passive: true });

    // X intercepts right-click with its own menu. Stop X's handler, NOT
    // the browser's native context menu (never call preventDefault).
    window.addEventListener('contextmenu', (event) => {
        const image = findPhotoImage(event.target);
        if (!image) return;
        preloadOriginal(image);
        event.stopImmediatePropagation();
    }, { capture: true, passive: false });
})();